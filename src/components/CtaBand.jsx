import { CONTACT, buildWhatsAppLink } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';
import { WhatsAppIcon } from './Hero.jsx';

export default function CtaBand() {
  const { t } = useLang();
  const reveal = useReveal();
  const waLink = buildWhatsAppLink("Hi Kathmandu Chilling, I'd like to discuss a cooling/dairy equipment requirement.");

  return (
    <section>
      <div className="wrap">
        <div className="cta-band reveal" ref={reveal}>
          <h3>{t('ctaBandText')}</h3>
          <div className="cta-actions">
            <a href="#contact" className="btn solid">{t('ctaPrimary')}</a>
            <a href={`tel:${CONTACT.primaryPhone}`} className="btn">{t('ctaSecondary')}</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn whatsapp">
              <WhatsAppIcon /> {t('ctaWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
