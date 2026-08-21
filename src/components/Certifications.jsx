import { useReveal } from '../hooks/useReveal';

const CERT_ITEMS = [
  {
    icon: '🎖️',
    title: 'ISO 9001:2015 Certified',
    desc: 'Standardized quality control across CNC fabrication, PUF panel injection, and refrigeration piping.',
  },
  {
    icon: '🥛',
    title: 'HACCP Food Safety Grade',
    desc: '100% sanitary SS 304 / SS 316 mirror-finished contact surfaces safe for milk, meat, and food processing.',
  },
  {
    icon: '💉',
    title: 'WHO PQS Pharma Standard',
    desc: 'Precision temperature stability (±0.5°C) compliant with WHO standards for vaccine & biological storage.',
  },
  {
    icon: '⚡',
    title: 'Nepal Grid Tropicalized',
    desc: 'Engineered with wide-range voltage tolerance and auto-restart for smooth operation during load shedding.',
  },
  {
    icon: '🔧',
    title: '2-Year On-Site Warranty',
    desc: 'Full parts & labor coverage backed by our rapid-response mobile service technicians across Nepal.',
  },
  {
    icon: '🇳🇵',
    title: 'All 7 Provinces Coverage',
    desc: 'Over 450+ successful installations from Terai agro corridors to high Himalayan districts.',
  },
];

export default function Certifications() {
  const headReveal = useReveal();

  return (
    <section className="certs-section">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">Quality &amp; Standards</div>
          <h2>Certified Manufacturing &amp; Nationwide Trust</h2>
          <p>
            Every chiller, freezer, and dairy processing line leaving our Kathmandu manufacturing facility
            meets rigorous international quality, food safety, and thermal efficiency benchmarks.
          </p>
        </div>

        <div className="certs-grid">
          {CERT_ITEMS.map((item, idx) => (
            <div className="cert-card" key={idx}>
              <div className="cert-icon-wrap">
                <span className="cert-icon">{item.icon}</span>
              </div>
              <div className="cert-content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
