import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from './Hero.jsx';
import SmartImage from './SmartImage.jsx';

export default function ProductCard({ item }) {
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const glareRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const onMouseMove = (e) => {
    const card = cardRef.current;
    const tilt = tiltRef.current;
    if (!card || !tilt) return;
    const stage = card.querySelector('.stage');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -14;
    const ry = (px - 0.5) * 14;
    tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    if (glareRef.current) {
      glareRef.current.style.setProperty('--gx', `${px * 100}%`);
      glareRef.current.style.setProperty('--gy', `${py * 100}%`);
    }
  };

  const onMouseLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  const waLink = buildWhatsAppLink(`Hi, I'm interested in the ${item.title}. Could you share technical specifications and quotation?`);

  return (
    <div className="card" ref={cardRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Link to={`/products/${item.slug}`} className="stage-link" aria-label={`View 3D details of ${item.title}`}>
        <div className="stage">
          <div className="stage-glow"></div>
          <div className="imgwrap">
            <div className="tilt" ref={tiltRef}>
              <SmartImage
                src={item.img}
                alt={item.title}
                icon={item.icon}
                ratio="4/3"
                onLoaded={() => setImgLoaded(true)}
              />
              <div className="glare" ref={glareRef}></div>
            </div>
          </div>
          {imgLoaded && <div className="reflection"><img src={item.img} alt="" aria-hidden="true" /></div>}
          {item.tempTag && <span className="temp-tag">{item.tempTag}</span>}
          <span className="badge-3d mono">🧊 3D SPECS</span>
        </div>
      </Link>

      <div className="card-body">
        <div className="card-title-row">
          <span className="card-icon">{item.icon}</span>
          <h4>
            <Link to={`/products/${item.slug}`}>{item.title}</Link>
          </h4>
        </div>
        <p>{item.desc}</p>
        <div className="card-actions">
          <Link className="view" to={`/products/${item.slug}`}>
            3D View &amp; Specs →
          </Link>
          <a
            className="wa-mini"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${item.title} on WhatsApp`}
          >
            <WhatsAppIcon size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
