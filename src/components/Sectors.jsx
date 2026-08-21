import { SECTORS } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';

export default function Sectors() {
  const { t } = useLang();
  const headReveal = useReveal();
  const gridReveal = useReveal();

  return (
    <section id="sectors">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">{t('sectorsEyebrow')}</div>
          <h2>{t('sectorsTitle')}</h2>
          <p>{t('sectorsText')}</p>
        </div>
        <div className="sector-grid reveal" ref={gridReveal}>
          {SECTORS.map((s) => (
            <div className="sector-cell" key={s.title}>
              <span className="icon">{s.icon}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
