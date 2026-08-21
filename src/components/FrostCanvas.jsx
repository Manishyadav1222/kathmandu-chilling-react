import { useEffect, useRef } from 'react';

export default function FrostCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W, H, particles, raf;
    let isTabVisible = true;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = Math.min(window.innerHeight * 1.1, 1000);
    }

    function initParticles() {
      particles = Array.from({ length: Math.min(50, Math.floor(W / 26)) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.4,
        s: Math.random() * 0.25 + 0.05,
        o: Math.random() * 0.4 + 0.1,
      }));
    }

    resize();
    initParticles();

    function draw() {
      if (!isTabVisible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = '#35D6FF';
        ctx.fill();
        p.y += p.s;
        if (p.y > H) {
          p.y = -5;
          p.x = Math.random() * W;
        }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      resize();
      initParticles();
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas className="frost-canvas" ref={canvasRef} aria-hidden="true" />;
}
