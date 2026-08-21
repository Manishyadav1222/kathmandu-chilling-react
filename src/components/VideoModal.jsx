import { useEffect } from 'react';

export default function VideoModal({ isOpen, onClose, videoTitle, videoDesc, videoUrl }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <div className="video-title-wrap">
            <span className="video-tag mono">KATHMANDU CHILLING FACTORY &amp; TECH TOUR</span>
            <h3>{videoTitle || 'Commercial Cold Storage & Dairy Manufacturing in Nepal'}</h3>
          </div>
          <button className="video-close-btn" onClick={onClose} aria-label="Close Video">
            ✕
          </button>
        </div>

        <div className="video-player-frame">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={videoTitle || 'Manufacturing Showcase'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="video-placeholder-scene">
              <div className="video-anim-graphic">
                <div className="pulse-circle"></div>
                <span className="anim-icon">🧊</span>
              </div>
              <h4>Direct Factory Walkthrough &amp; Machinery Testing</h4>
              <p>
                Take a tour of our Kathmandu factory: high-pressure PUF panel injection, CNC shearing,
                argon sanitary welding, and live helium pressure testing of refrigeration units.
              </p>
              <div className="video-factory-specs mono">
                <span>📍 Kathmandu, Nepal</span>
                <span>🏭 15,000+ sq. ft. Facility</span>
                <span>⚡ 100% Pre-tested Machinery</span>
              </div>
            </div>
          )}
        </div>

        {videoDesc && (
          <div className="video-modal-footer">
            <p>{videoDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
