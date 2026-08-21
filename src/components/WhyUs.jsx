import { WHY_US } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';

export default function WhyUs() {
  const { t } = useLang();
  const headReveal = useReveal();
  const gridReveal = useReveal();

  return (
    <section id="why">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">{t('whyEyebrow')}</div>
          <h2>{t('whyTitle')}</h2>
        </div>
        <div className="why-grid reveal" ref={gridReveal}>
          {WHY_US.map((w) => (
            <div className="why-card" key={w.num}>
              <span className="num">{w.num}</span>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
