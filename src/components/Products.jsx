import { useEffect, useRef, useState } from 'react';
import { PRODUCT_GROUPS } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';
import { useAdminData } from '../context/AdminDataContext.jsx';
import ProductCard from './ProductCard.jsx';

const SIDE_MIN = -20;
const SIDE_MAX = 25;
const SIDE_TRACK_HEIGHT = 180;

function ProductGroup({ group, onInView }) {
  const { t } = useLang();
  const reveal = useReveal();

  useEffect(() => {
    const el = reveal.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onInView(group);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [group, onInView, reveal]);

  return (
    <div className="prod-group reveal" ref={reveal}>
      <div className="prod-group-head">
        <h3>{group.title}</h3>
        {group.link && <a href={group.link}>{group.linkLabel}</a>}
      </div>
      <div className="prod-grid">
        {group.items.map((item) => (
          <ProductCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  const { t } = useLang();
  const { data } = useAdminData();
  const headReveal = useReveal();
  const [sideVisible, setSideVisible] = useState(false);
  const [sideLabel, setSideLabel] = useState('—');
  const [sideDotTop, setSideDotTop] = useState(0);
  const sectionRef = useRef(null);

  const groups = data?.categories || PRODUCT_GROUPS;

  const handleGroupInView = (group) => {
    const avg = ((group.min ?? -20) + (group.max ?? 25)) / 2;
    const clamped = Math.max(SIDE_MIN, Math.min(SIDE_MAX, avg));
    const pct = 1 - (clamped - SIDE_MIN) / (SIDE_MAX - SIDE_MIN);
    setSideDotTop(pct * (SIDE_TRACK_HEIGHT - 16));
    setSideLabel(group.section || group.title);
    setSideVisible(true);
  };

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) setSideVisible(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className={`side-gauge${sideVisible ? ' show' : ''}`}>
        <span className="lab">COLD CHAIN RANGE</span>
        <div className="track"><div className="dot" style={{ top: `${sideDotTop}px` }}></div></div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ice)' }}>{sideLabel}</span>
      </div>

      <section id="products" ref={sectionRef}>
        <div className="floor-grid"></div>
        <div className="wrap">
          <div className="section-head reveal" ref={headReveal}>
            <div className="eyebrow">{t('productsEyebrow')}</div>
            <h2>{t('productsTitle')}</h2>
            <p>{t('productsText')}</p>
          </div>

          {groups.map((group) => (
            <ProductGroup key={group.id} group={group} onInView={handleGroupInView} />
          ))}
        </div>
      </section>
    </>
  );
}
