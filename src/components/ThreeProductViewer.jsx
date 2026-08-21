import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

export default function ThreeProductViewer({ item }) {
  const containerRef = useRef(null);
  const [exploded, setExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [simTemp, setSimTemp] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [lightMode, setLightMode] = useState('cyan'); // 'cyan' | 'white' | 'deep'
  const [isDragging, setIsDragging] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  // References to keep Three.js state persistent across renders
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    rootGroup: null,
    explodedGroup: [],
    frameId: null,
    isInteracting: false,
    prevPointer: { x: 0, y: 0 },
    rotation: { x: 0.35, y: -0.6 },
    zoom: 4.8,
    targetExplode: 0,
    currentExplode: 0,
    tempLight: null,
    frostMesh: null,
  });

  const hotspots = item?.threeHotspots || [
    { label: 'High Density PUF (42 kg/m³)', pos: [-1, 0.5, 0.8], desc: 'Thermal conductivity < 0.022 W/mK' },
    { label: 'SS 304 Food-Safe Finish', pos: [0.8, -0.4, 0.8], desc: 'Mirror polished sanitary surface' },
    { label: 'High COP Compressor Unit', pos: [1.1, 0.8, -0.6], desc: 'Tropicalized for 45°C ambient summers' },
  ];

  // Initialize Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to 2D image preview:', err);
      setWebGLError(true);
      return;
    }

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070e1b);
    scene.fog = new THREE.FogExp2(0x070e1b, 0.08);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.0);

    // Clear previous canvas
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    // 3. Grid & Ground Shadow Plane
    const gridHelper = new THREE.GridHelper(12, 24, 0x35d6ff, 0x112338);
    gridHelper.position.y = -1.35;
    scene.add(gridHelper);

    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.34;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xdcf4ff, 0.95);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainLight.position.set(4, 6, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x35d6ff, 2.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const tempPointLight = new THREE.PointLight(0x35d6ff, 2.0, 9);
    tempPointLight.position.set(0, 0.5, 2.2);
    scene.add(tempPointLight);

    // 5. Build 3D Geometric Model based on Product Type
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const explodedLayers = [];

    // Materials with PBR metallic sheen
    const ssMat = new THREE.MeshStandardMaterial({
      color: 0xd8e4f0,
      metalness: 0.9,
      roughness: 0.18,
      envMapIntensity: 1.2,
    });

    const pufCoreMat = new THREE.MeshStandardMaterial({
      color: 0x1c7ba8,
      roughness: 0.5,
      metalness: 0.15,
      transparent: true,
      opacity: 0.85,
    });

    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd87834,
      metalness: 0.92,
      roughness: 0.25,
    });

    const blueInsulMat = new THREE.MeshStandardMaterial({
      color: 0x0c4277,
      metalness: 0.55,
      roughness: 0.35,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9fefff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.08,
      transmission: 0.75,
      thickness: 0.5,
    });

    const frostMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      transparent: true,
      opacity: 0.05,
    });

    // Determine model shape
    const modelType = item?.modelType || 'coldRoom';

    if (modelType === 'chillingVat') {
      // Cylindrical Milk Chilling VAT
      const vatGeo = new THREE.CylinderGeometry(0.95, 0.95, 1.4, 32);
      const vatMesh = new THREE.Mesh(vatGeo, ssMat);
      vatMesh.castShadow = true;
      vatMesh.receiveShadow = true;
      rootGroup.add(vatMesh);

      // Inner Dimple Jacket Layer (Explodable)
      const jacketGeo = new THREE.CylinderGeometry(1.05, 1.05, 1.2, 32, 1, true);
      const jacketMesh = new THREE.Mesh(jacketGeo, pufCoreMat);
      rootGroup.add(jacketMesh);
      explodedLayers.push({ mesh: jacketMesh, dir: new THREE.Vector3(0, 0, 0.8) });

      // Agitator Bridge & Motor
      const bridgeGeo = new THREE.BoxGeometry(2.1, 0.1, 0.3);
      const bridge = new THREE.Mesh(bridgeGeo, ssMat);
      bridge.position.y = 0.75;
      rootGroup.add(bridge);
      explodedLayers.push({ mesh: bridge, dir: new THREE.Vector3(0, 0.9, 0) });

      const motorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16);
      const motor = new THREE.Mesh(motorGeo, blueInsulMat);
      motor.position.y = 1.0;
      rootGroup.add(motor);
      explodedLayers.push({ mesh: motor, dir: new THREE.Vector3(0, 1.3, 0) });

      // Legs
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), ssMat);
        leg.position.set(Math.cos(angle) * 0.8, -0.9, Math.sin(angle) * 0.8);
        rootGroup.add(leg);
      }
    } else if (modelType === 'blastChiller') {
      // Blast Chiller Cabinet
      const cabGeo = new THREE.BoxGeometry(1.4, 1.9, 1.3);
      const cab = new THREE.Mesh(cabGeo, ssMat);
      cab.castShadow = true;
      cab.receiveShadow = true;
      rootGroup.add(cab);

      // Door (Explodable)
      const doorGeo = new THREE.BoxGeometry(1.3, 1.7, 0.1);
      const door = new THREE.Mesh(doorGeo, ssMat);
      door.position.set(0, 0, 0.7);
      rootGroup.add(door);
      explodedLayers.push({ mesh: door, dir: new THREE.Vector3(0, 0, 1.2) });

      // Internal Fan Turbine (Explodable)
      const fanGeo = new THREE.TorusGeometry(0.35, 0.08, 12, 24);
      const fan = new THREE.Mesh(fanGeo, copperMat);
      fan.position.set(0, 0.3, -0.4);
      rootGroup.add(fan);
      explodedLayers.push({ mesh: fan, dir: new THREE.Vector3(0, 0, -1.0) });

      // Touch Screen Panel
      const screenGeo = new THREE.BoxGeometry(0.35, 0.25, 0.02);
      const screen = new THREE.Mesh(screenGeo, glassMat);
      screen.position.set(0.4, 0.65, 0.76);
      door.add(screen);
    } else if (modelType === 'dairyPlant') {
      // Turnkey Dairy Skid
      const baseGeo = new THREE.BoxGeometry(2.4, 0.15, 1.6);
      const base = new THREE.Mesh(baseGeo, ssMat);
      base.position.y = -0.7;
      rootGroup.add(base);

      // Plate Heat Exchanger (PHE) Pack
      const pheGeo = new THREE.BoxGeometry(0.6, 1.4, 0.9);
      const phe = new THREE.Mesh(pheGeo, blueInsulMat);
      phe.position.set(-0.7, 0.1, 0);
      rootGroup.add(phe);
      explodedLayers.push({ mesh: phe, dir: new THREE.Vector3(-0.9, 0, 0) });

      // Holding Tubes (Copper / SS coils)
      const tubeGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 20);
      const tube = new THREE.Mesh(tubeGeo, copperMat);
      tube.position.set(0.2, 0.2, 0);
      rootGroup.add(tube);
      explodedLayers.push({ mesh: tube, dir: new THREE.Vector3(0, 0.8, 0) });

      // PLC Control Console
      const consoleGeo = new THREE.BoxGeometry(0.45, 0.8, 0.35);
      const consoleMesh = new THREE.Mesh(consoleGeo, ssMat);
      consoleMesh.position.set(0.8, 0.2, 0.4);
      rootGroup.add(consoleMesh);
      explodedLayers.push({ mesh: consoleMesh, dir: new THREE.Vector3(0.9, 0, 0.5) });
    } else if (modelType === 'roadTanker') {
      // Road Milk Tanker
      const tankGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.6, 32);
      const tank = new THREE.Mesh(tankGeo, ssMat);
      tank.rotation.z = Math.PI / 2;
      tank.castShadow = true;
      rootGroup.add(tank);

      // Insulated Outer Cladding (Explodable)
      const shellGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.7, 32, 1, true);
      const shell = new THREE.Mesh(shellGeo, pufCoreMat);
      shell.rotation.z = Math.PI / 2;
      rootGroup.add(shell);
      explodedLayers.push({ mesh: shell, dir: new THREE.Vector3(0, 0.8, 0) });

      // Manholes on top
      for (let i = -0.7; i <= 0.7; i += 1.4) {
        const mh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16), ssMat);
        mh.position.set(i, 0.9, 0);
        rootGroup.add(mh);
        explodedLayers.push({ mesh: mh, dir: new THREE.Vector3(0, 1.2, 0) });
      }
    } else if (modelType === 'displayUnit') {
      // Supermarket Multi-Deck Display Chiller
      const frameGeo = new THREE.BoxGeometry(2.0, 1.8, 0.9);
      const frame = new THREE.Mesh(frameGeo, blueInsulMat);
      rootGroup.add(frame);

      // Glass Front Doors (Explodable)
      const glassGeo = new THREE.BoxGeometry(1.9, 1.6, 0.05);
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(0, 0, 0.48);
      rootGroup.add(glass);
      explodedLayers.push({ mesh: glass, dir: new THREE.Vector3(0, 0, 0.9) });

      // Internal LED Display Shelves
      for (let y = -0.4; y <= 0.4; y += 0.4) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 0.7), ssMat);
        shelf.position.set(0, y, 0);
        rootGroup.add(shelf);
      }
    } else if (modelType === 'iceCreamFreezer') {
      // Ice Cream Batch Freezer
      const bodyGeo = new THREE.BoxGeometry(1.0, 1.6, 1.1);
      const body = new THREE.Mesh(bodyGeo, ssMat);
      rootGroup.add(body);

      // Horizontal Freezing Cylinder (Explodable)
      const cylGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 24);
      const cyl = new THREE.Mesh(cylGeo, copperMat);
      cyl.rotation.x = Math.PI / 2;
      cyl.position.set(0, 0.2, 0.1);
      rootGroup.add(cyl);
      explodedLayers.push({ mesh: cyl, dir: new THREE.Vector3(0, 0, 0.9) });
    } else {
      // Default: Modular Cold Room / Walk-in Freezer Chamber
      // 1. PUF Main Chamber Box
      const chamberGeo = new THREE.BoxGeometry(2.2, 1.8, 2.2);
      const chamber = new THREE.Mesh(chamberGeo, ssMat);
      chamber.castShadow = true;
      chamber.receiveShadow = true;
      rootGroup.add(chamber);

      // 2. PUF Insulation Core Layer (Explodable)
      const pufLayerGeo = new THREE.BoxGeometry(2.35, 1.95, 2.35);
      const pufLayer = new THREE.Mesh(pufLayerGeo, pufCoreMat);
      rootGroup.add(pufLayer);
      explodedLayers.push({ mesh: pufLayer, dir: new THREE.Vector3(0, 0.8, 0) });

      // 3. Cam-lock Insulated Front Door (Explodable)
      const doorGeo = new THREE.BoxGeometry(0.9, 1.5, 0.12);
      const door = new THREE.Mesh(doorGeo, ssMat);
      door.position.set(-0.35, -0.1, 1.15);
      rootGroup.add(door);
      explodedLayers.push({ mesh: door, dir: new THREE.Vector3(-0.8, 0, 1.4) });

      // 4. Roof-Mounted Monoblock Condensing Unit (Explodable)
      const unitGeo = new THREE.BoxGeometry(0.8, 0.5, 0.7);
      const unit = new THREE.Mesh(unitGeo, blueInsulMat);
      unit.position.set(0.6, 1.2, 0.4);
      rootGroup.add(unit);
      explodedLayers.push({ mesh: unit, dir: new THREE.Vector3(1.0, 1.1, 0) });

      // 5. Internal Copper Evaporator Coil Array
      const coilGeo = new THREE.TorusGeometry(0.25, 0.04, 12, 24);
      const coil = new THREE.Mesh(coilGeo, copperMat);
      coil.position.set(0.6, 0.5, -0.6);
      rootGroup.add(coil);
      explodedLayers.push({ mesh: coil, dir: new THREE.Vector3(0, 0, -1.2) });
    }

    // Frost Overlay Layer
    const frostBox = new THREE.BoxGeometry(2.6, 2.2, 2.6);
    const frostMesh = new THREE.Mesh(frostBox, frostMat);
    rootGroup.add(frostMesh);

    // Save references to stateRef
    stateRef.current = {
      ...stateRef.current,
      scene,
      camera,
      renderer,
      rootGroup,
      explodedGroup: explodedLayers,
      tempLight: tempPointLight,
      frostMesh,
    };

    // Animation Loop
    let lastTime = performance.now();
    const animate = (now) => {
      stateRef.current.frameId = requestAnimationFrame(animate);
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Auto-rotation when not user interacting
      if (autoRotate && !stateRef.current.isInteracting) {
        stateRef.current.rotation.y += delta * 0.45;
      }

      // Smooth camera orbit
      const rX = stateRef.current.rotation.x;
      const rY = stateRef.current.rotation.y;
      const dist = stateRef.current.zoom;

      camera.position.x = dist * Math.cos(rX) * Math.sin(rY);
      camera.position.y = dist * Math.sin(rX) + 0.3;
      camera.position.z = dist * Math.cos(rX) * Math.cos(rY);
      camera.lookAt(0, 0.1, 0);

      // Smooth Exploded View Interpolation
      const curExp = stateRef.current.currentExplode;
      const tarExp = stateRef.current.targetExplode;
      stateRef.current.currentExplode += (tarExp - curExp) * 0.08;

      const expVal = stateRef.current.currentExplode;
      stateRef.current.explodedGroup.forEach(({ mesh, dir }) => {
        if (mesh && dir) {
          mesh.position.set(dir.x * expVal, dir.y * expVal, dir.z * expVal);
        }
      });

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(stateRef.current.frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [item]);

  // Handle Explode Toggle
  useEffect(() => {
    stateRef.current.targetExplode = exploded ? 1.0 : 0.0;
  }, [exploded]);

  // Handle Light Mode
  useEffect(() => {
    if (!stateRef.current.scene) return;
    const colors = {
      cyan: { light: 0x35d6ff, bg: 0x070e1b, fog: 0x070e1b },
      white: { light: 0xffffff, bg: 0x0f1724, fog: 0x0f1724 },
      deep: { light: 0x0088ff, bg: 0x03070e, fog: 0x03070e },
    };
    const c = colors[lightMode] || colors.cyan;
    if (stateRef.current.tempLight) stateRef.current.tempLight.color.setHex(c.light);
    if (stateRef.current.scene) {
      stateRef.current.scene.background.setHex(c.bg);
      stateRef.current.scene.fog.color.setHex(c.fog);
    }
  }, [lightMode]);

  // Handle Temperature Simulator Slider
  useEffect(() => {
    if (stateRef.current.tempLight) {
      if (simTemp < 0) {
        // Sub-zero frost blue / cyan
        const frostIntensity = Math.min(3.5, 1.2 + Math.abs(simTemp) * 0.08);
        stateRef.current.tempLight.color.setHex(0x35d6ff);
        stateRef.current.tempLight.intensity = frostIntensity;
      } else {
        // Warm orange / amber glow
        stateRef.current.tempLight.color.setHex(0xff7a45);
        stateRef.current.tempLight.intensity = 1.4;
      }
    }
    if (stateRef.current.frostMesh) {
      const frostOpacity = simTemp < 0 ? Math.min(0.35, Math.abs(simTemp) * 0.015) : 0.02;
      stateRef.current.frostMesh.material.opacity = frostOpacity;
    }
  }, [simTemp]);

  // Mouse & Touch Drag Controls
  const handlePointerDown = (e) => {
    setIsDragging(true);
    stateRef.current.isInteracting = true;
    stateRef.current.prevPointer = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - stateRef.current.prevPointer.x;
    const dy = e.clientY - stateRef.current.prevPointer.y;
    stateRef.current.prevPointer = { x: e.clientX, y: e.clientY };

    stateRef.current.rotation.y += dx * 0.008;
    stateRef.current.rotation.x = Math.max(
      -0.4,
      Math.min(1.2, stateRef.current.rotation.x + dy * 0.008)
    );
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    stateRef.current.isInteracting = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    stateRef.current.zoom = Math.max(3.2, Math.min(7.5, stateRef.current.zoom + e.deltaY * 0.003));
  };

  if (webGLError) {
    return (
      <div className="three-viewer-wrap webgl-fallback-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(8, 16, 28, 0.7)', borderRadius: '16px', border: '1px solid var(--line)' }}>
        <img
          src={item?.img || '/images/products/cold-room-main.jpg'}
          alt={item?.title || 'Machinery'}
          style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
        />
        <p className="mono" style={{ color: 'var(--ice)', fontSize: '13px', margin: 0 }}>
          ⚡ 2D High-Definition Factory View Active
        </p>
      </div>
    );
  }

  return (
    <div className="three-viewer-wrap">
      {/* 3D Canvas Container */}
      <div
        className="three-canvas-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Live 3D Overlay Badges */}
        <div className="three-overlay-top">
          <div className="three-badge-live">
            <span className="live-pulse"></span>
            <span>3D WEBGL INTERACTIVE MODEL</span>
          </div>
          <div className="three-badge-controls">
            <span className="badge-hint">Drag 360° · Scroll to Zoom</span>
          </div>
        </div>

        {/* Hotspot Pins on Model */}
        <div className="three-hotspot-layer">
          {hotspots.map((hs, i) => (
            <button
              key={i}
              className={`three-hotspot-pin ${activeHotspot === i ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === i ? null : i);
              }}
              aria-label={`Hotspot ${hs.label}`}
            >
              <span className="pin-circle">+</span>
              <span className="pin-label">{hs.label}</span>
            </button>
          ))}
        </div>

        {/* Active Hotspot Detail Card */}
        {activeHotspot !== null && hotspots[activeHotspot] && (
          <div className="hotspot-popup">
            <div className="hotspot-popup-head">
              <strong>{hotspots[activeHotspot].label}</strong>
              <button onClick={() => setActiveHotspot(null)}>✕</button>
            </div>
            <p>{hotspots[activeHotspot].desc}</p>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="three-controls-bar">
        <div className="controls-group">
          <button
            className={`btn-ctrl ${exploded ? 'active' : ''}`}
            onClick={() => setExploded(!exploded)}
            title="Explode 3D Layers to see internal PUF core, coils and compressor"
          >
            {exploded ? ' Assemble Layers' : '🔍 Explode 3D Layers'}
          </button>
          <button
            className={`btn-ctrl ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle 360 Auto-Rotation"
          >
            {autoRotate ? '⏸ Pause Spin' : '▶ 360° Spin'}
          </button>
          <button
            className="btn-ctrl"
            onClick={() => {
              stateRef.current.rotation = { x: 0.35, y: -0.6 };
              stateRef.current.zoom = 4.8;
              setExploded(false);
            }}
            title="Reset Camera View"
          >
            ↺ Reset View
          </button>
        </div>

        {/* Lighting Selector */}
        <div className="controls-group lighting-group">
          <span className="ctrl-label">Atmosphere:</span>
          <button
            className={`btn-pill ${lightMode === 'cyan' ? 'active' : ''}`}
            onClick={() => setLightMode('cyan')}
          >
            Frost Cyan
          </button>
          <button
            className={`btn-pill ${lightMode === 'white' ? 'active' : ''}`}
            onClick={() => setLightMode('white')}
          >
            Studio White
          </button>
          <button
            className={`btn-pill ${lightMode === 'deep' ? 'active' : ''}`}
            onClick={() => setLightMode('deep')}
          >
            Night Deep
          </button>
        </div>
      </div>

      {/* Temperature Cooling Simulation Slider */}
      <div className="three-temp-simulator">
        <div className="simulator-head">
          <div className="sim-title">
            <span className="sim-icon">⚡</span>
            <strong>Thermal Pull-Down Simulator</strong>
          </div>
          <div className="sim-reading mono">
            Target Temp: <span className={simTemp < 0 ? 'subzero' : 'positive'}>{simTemp}°C</span>
          </div>
        </div>
        <div className="slider-wrapper">
          <input
            type="range"
            min="-35"
            max="45"
            value={simTemp}
            onChange={(e) => setSimTemp(Number(e.target.value))}
            className="temp-range-input"
          />
          <div className="slider-ticks">
            <span>−35°C (Blast)</span>
            <span>−20°C (Freezer)</span>
            <span>0°C (Ice)</span>
            <span>+4°C (Dairy)</span>
            <span>+45°C (Ambient)</span>
          </div>
        </div>
        <div className="simulator-metrics">
          <div className="metric-box">
            <span className="metric-label">Pull-Down Speed</span>
            <span className="metric-val">{simTemp < 0 ? '< 110 Mins' : '< 40 Mins'}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Calculated Power</span>
            <span className="metric-val">{simTemp < -10 ? '4.8 kW' : '2.4 kW'}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Thermal COP</span>
            <span className="metric-val">{simTemp < 0 ? '3.4 (Optimal)' : '4.2 (High)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
