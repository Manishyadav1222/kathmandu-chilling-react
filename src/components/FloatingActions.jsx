import { useEffect, useState } from 'react';
import { buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from './Hero.jsx';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waLink = buildWhatsAppLink("Hi Kathmandu Chilling, I'd like some help.");

  return (
    <>
      <a
        className="wa-float"
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon size={26} />
      </a>
      <button
        className={`back-top${showTop ? ' show' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}
