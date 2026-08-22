import React, { useState, useRef, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { buildWhatsAppLink } from '../data/content';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { WhatsAppIcon } from './Hero.jsx';

export default function VideoReels() {
  const headReveal = useReveal();
  const { data } = useAdminData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeModalReel, setActiveModalReel] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [mutedStates, setMutedStates] = useState({});

  const videoList = data?.videos || [];

  const categories = [
    'All',
    'Cold Storage',
    'Dairy Processing',
    'Blast Freezers',
    'TikTok',
    'Facebook',
  ];

  const filteredVideos =
    activeCategory === 'All'
      ? videoList
      : videoList.filter(
          (v) =>
            (v.category || '').toLowerCase().includes(activeCategory.toLowerCase()) ||
            (v.platform || '').toLowerCase().includes(activeCategory.toLowerCase())
        );

  const toggleSound = (e, vidId) => {
    e.stopPropagation();
    setMutedStates((prev) => ({
      ...prev,
      [vidId]: !prev[vidId],
    }));
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok':
        return '🎵 TikTok';
      case 'facebook':
        return '📘 Facebook';
      case 'instagram':
        return '📸 Instagram';
      case 'youtube shorts':
        return '🔴 Shorts';
      default:
        return '📹 Site Reel';
    }
  };

  return (
    <section className="video-reels-section" id="videos">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">9:16 Vertical Video Reels &amp; Site Shorts</div>
          <h2>Live Machinery Demos, TikTok &amp; Field Reels</h2>
          <p>
            Watch real-time fabrication videos, mobile field tests, and video shorts of our cold rooms,
            dairy equipment, and turnkey plant installations across Nepal.
          </p>

          {/* Filter Pills */}
          <div className="reels-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`reel-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 9:16 Video Reels Grid */}
        <div className="reels-grid">
          {filteredVideos.map((reel) => {
            const isPlaying = playingVideoId === reel.id;
            const isMuted = mutedStates[reel.id] !== false; // default to muted
            const waLink = buildWhatsAppLink(
              reel.waMsg || `Hi Kathmandu Chilling, I saw your "${reel.title}" video reel and would like quotation/details.`
            );

            return (
              <div
                key={reel.id}
                className={`reel-card-916 ${isPlaying ? 'playing' : ''}`}
                onClick={() => setActiveModalReel(reel)}
                onMouseEnter={() => setPlayingVideoId(reel.id)}
                onMouseLeave={() => setPlayingVideoId(null)}
              >
                {/* 9:16 HTML5 Video or Poster */}
                {reel.videoUrl ? (
                  <video
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    className="reel-video-element"
                    loop
                    muted={isMuted}
                    playsInline
                    autoPlay={isPlaying}
                    ref={(el) => {
                      if (el) {
                        if (isPlaying) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                        }
                      }
                    }}
                  />
                ) : (
                  <img
                    src={reel.posterUrl || '/images/coldroom.jpeg'}
                    alt={reel.title}
                    className="reel-video-element"
                  />
                )}

                {/* Cyber Gradient Overlay */}
                <div className="reel-gradient-overlay"></div>

                {/* Top Badges */}
                <div className="reel-top-badges">
                  <span className="reel-platform-tag mono">
                    {getPlatformIcon(reel.platform)}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {reel.duration && (
                      <span className="reel-views-pill mono">⏱ {reel.duration}</span>
                    )}
                    {reel.videoUrl && (
                      <button
                        type="button"
                        onClick={(e) => toggleSound(e, reel.id)}
                        className="reel-views-pill mono"
                        style={{ cursor: 'pointer', background: isMuted ? 'rgba(0,0,0,0.6)' : 'var(--ice)', color: isMuted ? '#fff' : '#000' }}
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? '🔇' : '🔊'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Center Play Button Cue */}
                <div className="reel-play-icon-center">▶</div>

                {/* Bottom Meta & Action */}
                <div className="reel-bottom-info">
                  <div className="reel-cat-row mono">
                    <span>{reel.category}</span>
                    {reel.tag && <span style={{ marginLeft: '6px', color: reel.tagColor || 'var(--ice)' }}>· {reel.tag}</span>}
                  </div>
                  <h3 className="reel-title">{reel.title}</h3>
                  <p className="reel-desc">{reel.desc}</p>

                  <div className="reel-action-strip">
                    <span className="reel-btn-open mono">
                      <span>Watch Full Reel</span>
                      <span>↗</span>
                    </span>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reel-btn-wa"
                      onClick={(e) => e.stopPropagation()}
                      title="Ask about this video on WhatsApp"
                    >
                      <WhatsAppIcon size={15} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Reel Lightbox Modal */}
      {activeModalReel && (
        <div className="reel-modal-backdrop" onClick={() => setActiveModalReel(null)}>
          <div className="reel-modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="reel-modal-close-btn"
              onClick={() => setActiveModalReel(null)}
              aria-label="Close Reel Modal"
            >
              ✕
            </button>

            {/* Left 9:16 Video Player Stage */}
            <div className="reel-modal-video-box">
              {activeModalReel.videoUrl ? (
                <video
                  src={activeModalReel.videoUrl}
                  poster={activeModalReel.posterUrl}
                  controls
                  autoPlay
                  playsInline
                  loop
                />
              ) : (
                <img
                  src={activeModalReel.posterUrl || '/images/coldroom.jpeg'}
                  alt={activeModalReel.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Right Information & WhatsApp Action Pane */}
            <div className="reel-modal-info-box">
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="mono" style={{ color: 'var(--ice)', fontSize: '11px', fontWeight: 'bold' }}>
                    {activeModalReel.category?.toUpperCase()}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <span className="mono" style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {getPlatformIcon(activeModalReel.platform)}
                  </span>
                </div>

                <h2 style={{ fontSize: '20px', color: '#fff', lineHeight: '1.3', marginBottom: '12px' }}>
                  {activeModalReel.title}
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.5', marginBottom: '16px' }}>
                  {activeModalReel.desc}
                </p>

                <div style={{ background: 'rgba(53, 214, 255, 0.05)', border: '1px solid rgba(53, 214, 255, 0.2)', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--ice)', marginBottom: '4px' }}>
                    ⚡ MACHINERY &amp; ENGINEERING SPECS
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#e2e8f0' }}>
                    Custom built and quality-tested in Kathmandu, Nepal with genuine Japanese/German components.
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={buildWhatsAppLink(
                    activeModalReel.waMsg || `Hi Kathmandu Chilling, I am inquiring about the ${activeModalReel.title} video reel.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn whatsapp btn-large"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <WhatsAppIcon size={18} /> Inquire About This Video On WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
