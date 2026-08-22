import { useState, useEffect } from 'react';

/**
 * Modern, resilient image wrapper:
 *  - uniform aspect-ratio frame (no layout shift)
 *  - lazy loading (unless `eager`)
 *  - shimmer skeleton while the image loads
 *  - automatic branded fallback (icon + name) if the URL fails or is empty
 *  - auto-resets loaded & failed states when `src` updates (e.g. from Admin edits)
 *  - reports load success/failure to the parent via onLoaded/onError
 */
export default function SmartImage({
  src,
  alt,
  icon = '🧊',
  ratio = '4/3',
  eager = false,
  onLoaded,
  onError,
  className = '',
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Automatically reset load status when the image source changes in real-time
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  // If no source provided or failed, immediately display rich branded fallback
  if (!src || failed) {
    return (
      <div
        className={`smart-fallback ${className}`.trim()}
        style={{ aspectRatio: ratio }}
        role="img"
        aria-label={alt}
      >
        <span className="smart-fallback-icon">{icon}</span>
        <span className="smart-fallback-name">{alt || 'Kathmandu Chilling Equipment'}</span>
      </div>
    );
  }

  return (
    <div
      className={`smart-img ${loaded ? 'loaded' : 'loading'} ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      <img
        key={src}
        src={src}
        alt={alt || ''}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => {
          setLoaded(true);
          if (onLoaded) onLoaded();
        }}
        onError={() => {
          setFailed(true);
          if (onError) onError();
        }}
      />
    </div>
  );
}