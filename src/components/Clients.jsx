import { CLIENTS } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';

export default function Clients() {
  const { t } = useLang();
  const headReveal = useReveal();
  const stripReveal = useReveal();
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section id="clients">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">{t('clientsEyebrow')}</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>{t('clientsTitle')}</h2>
        </div>
        <div className="client-strip reveal" ref={stripReveal}>
          <div className="client-track">
            {doubled.map((c, i) => (
              <div className="client-cell" key={`${c.name}-${i}`}>
                <img src={c.img} alt={c.name} />
                <span className="client-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
