import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const TECH_PILLARS = [
  {
    id: 'inverter',
    title: 'Inverter Scroll Technology',
    tagline: 'Up to 35% Lower Electricity Consumption',
    icon: '⚡',
    stats: [
      { label: 'Energy Savings', val: 'Up to 35%' },
      { label: 'Voltage Tolerance', val: '160V – 460V' },
      { label: 'Compressor Lifespan', val: '12+ Years' },
    ],
    desc: 'Equipped with intelligent variable-speed scroll compressors that continuously adapt chilling output to real-time thermal load. Eliminates harsh start-stop surges on Nepal’s electrical grid and guarantees whisper-quiet operation with minimal wear.',
    features: [
      'Soft-start electronic drive eliminates high inrush current',
      'Continuous partial-load efficiency during off-peak hours',
      'Compatible with diesel generator and solar backup systems',
      'Extended compressor lifespan due to reduced mechanical cycles',
    ],
  },
  {
    id: 'jacket',
    title: 'Laser-Welded Dimple Jackets',
    tagline: 'Uniform Rapid Heat Extraction for Dairy & Liquids',
    icon: '🛡️',
    stats: [
      { label: 'Cooling Time', val: '< 2 Hours' },
      { label: 'Steel Grade', val: 'SS 304 / 316' },
      { label: 'Surface Finish', val: 'Ra < 0.4 µm' },
    ],
    desc: 'High-precision CNC laser-welded dimple cooling jackets create turbulent refrigerant flow around the inner sanitary vessel. This maximizes heat exchange surface area, preventing hot spots and milk scorching while ensuring 100% sanitary food contact.',
    features: [
      'Double-jacketed safety barrier prevents any refrigerant cross-contamination',
      'Automated sanitary Clean-In-Place (CIP) rotary spray balls included',
      'Mirror-polished mirror finish inhibits bacterial biofilm accumulation',
      'Tested to 25 bar hydraulic pressure before delivery',
    ],
  },
  {
    id: 'iot',
    title: 'Smart IoT Cloud Telemetry',
    tagline: '24/7 Real-Time Remote Temperature & Power Monitoring',
    icon: '📡',
    stats: [
      { label: 'Alert Latency', val: '< 5 Seconds' },
      { label: 'Data Retention', val: '3 Years Cloud' },
      { label: 'Sensor Accuracy', val: '± 0.1°C' },
    ],
    desc: 'Every cold room and bulk chilling vat can be monitored remotely from your smartphone or central dashboard. Automated SMS and mobile notifications alert you instantly if temperature drifts beyond preset safety thresholds or if power fails.',
    features: [
      'Multi-point temperature & humidity probe data logging',
      'Instant SMS / WhatsApp alerts on power outage or door left open',
      'HACCP-compliant PDF audit report generation with 1 click',
      'Remote compressor diagnostics and fault code analysis',
    ],
  },
  {
    id: 'eco',
    title: 'Eco-Green Refrigeration',
    tagline: 'Zero Ozone Depletion & Ultra-Low Global Warming Potential',
    icon: '🌱',
    stats: [
      { label: 'Ozone Depletion', val: '0.00 ODP' },
      { label: 'Thermal COP', val: 'Up to 4.2' },
      { label: 'Compliance', val: 'Montreal Protocol' },
    ],
    desc: 'We utilize next-generation eco-friendly refrigerants (R404A, R448A, R290, R134a) engineered for high thermodynamic coefficient of performance (COP) and zero ozone layer impact in compliance with international environmental standards.',
    features: [
      'Zero Ozone Depletion Potential (ODP) certified gases',
      'High thermal heat transfer coefficient lowers refrigerant mass charge',
      'Future-proof against global hydrofluorocarbon phase-down regulations',
      'Non-toxic and non-flammable safety classifications',
    ],
  },
  {
    id: 'puf',
    title: 'High-Density PUF Core (42 kg/m³)',
    tagline: 'Cam-Lock Modular Panels with Zero Thermal Bridging',
    icon: '🧊',
    stats: [
      { label: 'Core Density', val: '42 ± 2 kg/m³' },
      { label: 'Thermal K-Value', val: '0.021 W/m·K' },
      { label: 'Fire Rating', val: 'Self-Extinguishing' },
    ],
    desc: 'High-pressure continuous foaming injection ensures uniform closed-cell PUF insulation without air voids. Concealed eccentric cam-lock joints pull panels tightly together with high-elasticity silicone gaskets for 100% airtight seams.',
    features: [
      'Tongue-and-groove interlocking profiles eliminate thermal leakage',
      'Available in 60mm, 80mm, 100mm, 120mm, and 150mm thicknesses',
      'Clad in 0.5mm pre-painted galvanized steel (PPGI) or SS 304',
      'Heavy-duty insulated doors with built-in perimeter heater wires',
    ],
  },
];

export default function TechEdge() {
  const headReveal = useReveal();
  const [activePillar, setActivePillar] = useState(TECH_PILLARS[0]);

  return (
    <section className="techedge-section" id="technology">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">The Kathmandu Chilling Advantage</div>
          <h2>Next-Generation Technology &amp; Engineering Edge</h2>
          <p>
            Engineered to the rigorous industrial benchmarks of Rockwell and Blue Star, tailored specifically
            for Nepal’s electrical infrastructure and climatic conditions.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="tech-nav-tabs">
          {TECH_PILLARS.map((p) => (
            <button
              key={p.id}
              className={`tech-tab-btn ${activePillar.id === p.id ? 'active' : ''}`}
              onClick={() => setActivePillar(p)}
            >
              <span className="tab-icon">{p.icon}</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        {/* Active Pillar Card */}
        <div className="tech-display-card">
          <div className="tech-card-grid">
            <div className="tech-info-pane">
              <div className="tech-badge-row mono">
                <span className="tech-tag">TECHNOLOGY HIGHLIGHT</span>
                <span className="tech-sub">{activePillar.tagline}</span>
              </div>
              <h3>{activePillar.title}</h3>
              <p className="tech-desc">{activePillar.desc}</p>

              <div className="tech-features-list">
                {activePillar.features.map((feat, idx) => (
                  <div className="tech-feat-item" key={idx}>
                    <span className="feat-check">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tech-metrics-pane">
              <div className="metrics-box-grid">
                {activePillar.stats.map((st, idx) => (
                  <div className="tech-stat-card" key={idx}>
                    <span className="stat-label">{st.label}</span>
                    <strong className="stat-value mono">{st.val}</strong>
                  </div>
                ))}
              </div>
              <div className="tech-trust-callout">
                <div className="callout-icon">🏆</div>
                <div className="callout-text">
                  <strong>Nepal Factory Certified</strong>
                  <p>All machinery assembled, pressure-tested &amp; quality-inspected at our Kathmandu plant.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
