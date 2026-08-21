import { useState } from 'react';
import { CONTACT, WHATSAPP_LOCAL_NUMBER, buildWhatsAppLink } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useReveal } from '../hooks/useReveal';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { WhatsAppIcon } from './Hero.jsx';

const PRODUCT_OPTIONS = [
  'Cold Room',
  'Walk-in Freezer / Chiller',
  'Blast Chiller',
  'Dairy Plant',
  'Chilling Vat',
  'Road Milk Tanker',
  'Other Equipment',
];

export default function Contact() {
  const { t } = useLang();
  const { addInquiry } = useAdminData();
  const headReveal = useReveal();
  const infoReveal = useReveal();
  const formReveal = useReveal();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: PRODUCT_OPTIONS[0],
    details: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sent

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log to Admin CRM
    addInquiry({
      name: form.name,
      phone: form.phone,
      email: form.email,
      interest: form.interest,
      details: form.details,
      district: 'Website Contact Form',
    });

    const message = [
      'New quote request from the website:',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Interested in: ${form.interest}`,
      form.details ? `Details: ${form.details}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    setStatus('sent');
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">{t('contactEyebrow')}</div>
          <h2>{t('contactTitle')}</h2>
          <p>{t('contactText')}</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info reveal" ref={infoReveal}>
            <div className="item">
              <span className="ic">📍</span>
              <div><h4>{t('contactAddressTitle')}</h4><p>{t('contactAddressText')}</p></div>
            </div>
            <div className="item">
              <span className="ic">📞</span>
              <div>
                <h4>{t('contactPhoneTitle')}</h4>
                <p>
                  {CONTACT.phones.map((p, i) => (
                    <span key={p}>
                      <a href={`tel:${p.replace(/-/g, '')}`}>{p}</a>
                      {i < CONTACT.phones.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="item">
              <span className="ic"><WhatsAppIcon size={18} /></span>
              <div>
                <h4>{t('contactWhatsappTitle')}</h4>
                <p><a href={buildWhatsAppLink('Hi Kathmandu Chilling, I have a question.')} target="_blank" rel="noopener noreferrer">+977 {WHATSAPP_LOCAL_NUMBER}</a></p>
              </div>
            </div>
            <div className="item">
              <span className="ic">✉️</span>
              <div><h4>{t('contactEmailTitle')}</h4><p><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p></div>
            </div>
            <div className="item">
              <span className="ic">🧊</span>
              <div><h4>{t('contactServiceTitle')}</h4><p>{t('contactServiceText')}</p></div>
            </div>
            <div className="item">
              <span className="ic">🌐</span>
              <div><h4>Follow</h4><p><a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></p></div>
            </div>
            <div className="map-embed">
              <iframe
                title="Location map"
                src="https://maps.google.com/maps?q=Naya%20Naikap%2C%20Chandragiri%2C%20Kathmandu%2C%20Nepal&t=m&z=13&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <form className="quote reveal" ref={formReveal} onSubmit={handleSubmit}>
            <div className="row">
              <div>
                <label>Name</label>
                <input type="text" required placeholder="Your full name" value={form.name} onChange={update('name')} />
              </div>
              <div>
                <label>Phone</label>
                <input type="tel" required placeholder="98XXXXXXXX" value={form.phone} onChange={update('phone')} />
              </div>
            </div>
            <div className="row">
              <div>
                <label>Email</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} />
              </div>
              <div>
                <label>Interested in</label>
                <select value={form.interest} onChange={update('interest')}>
                  {PRODUCT_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="full">
              <label>Details</label>
              <textarea
                rows="4"
                placeholder="Tell us about capacity, space and timeline..."
                value={form.details}
                onChange={update('details')}
              ></textarea>
            </div>
            <button type="submit" className="btn solid whatsapp-submit">
              <WhatsAppIcon /> {status === 'sent' ? t('formSending') : t('formSendWhatsapp')}
            </button>
            {status === 'sent' && (
              <p className="form-note">Opened WhatsApp with your request pre-filled — just hit send there.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
