import { CLIENTS } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';
import { useAdminData } from '../context/AdminDataContext.jsx';
import SmartImage from './SmartImage.jsx';

export default function Clients() {
  const { t } = useLang();
  const headReveal = useReveal();
  const stripReveal = useReveal();
  const { data } = useAdminData();

  const clientList = data?.clients && data.clients.length > 0 ? data.clients : CLIENTS;
  const doubled = [...clientList, ...clientList, ...clientList];

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
                {c.img ? (
                  <SmartImage src={c.img} alt={c.name} icon="🏢" ratio="16/9" className="client-logo-img" />
                ) : (
                  <div className="client-logo-fallback mono">{c.name.slice(0, 3).toUpperCase()}</div>
                )}
                <span className="client-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
