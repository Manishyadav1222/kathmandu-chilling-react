import { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getProductBySlug, buildWhatsAppLink, PRODUCT_GROUPS, CONTACT, PROJECTS } from '../data/content';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useSeo } from '../hooks/useSeo';
import { WhatsAppIcon } from './Hero.jsx';
import ThreeProductViewer from './ThreeProductViewer.jsx';
import SmartImage from './SmartImage.jsx';
import NotFound from './blog/NotFound.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { data } = useAdminData();
  const [activeView, setActiveView] = useState('3d'); // '3d' | 'gallery'
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // Support both /products/:slug, /product/:slug and /product-detail?product=xyz
  const productSlug = slug || searchParams.get('product') || 'cold-room';
  const allProducts = (data?.categories || PRODUCT_GROUPS).flatMap((c) => c.items || []);
  const item = allProducts.find((p) => p.slug === productSlug) || getProductBySlug(productSlug);

  // Gallery photos list
  const galleryList = item?.gallery || [
    { url: item?.img || '/images/products/cold-room-main.jpg', caption: 'High-Performance Factory Build' },
  ];

  // SEO & Structured Data Schemas
  const jsonLd = useMemo(() => {
    if (!item) return null;

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kathmanduchilling.com.np/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://kathmanduchilling.com.np/#products' },
        { '@type': 'ListItem', position: 3, name: item.title, item: `https://kathmanduchilling.com.np/products/${item.slug}` },
      ],
    };

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${item.title} - Industrial Cold Storage & Dairy Equipment`,
      image: item.img,
      description: item.tagline || item.desc,
      brand: {
        '@type': 'Brand',
        name: 'Kathmandu Chilling',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'NPR',
        price: 'Contact for Quote',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.',
          telephone: CONTACT.primaryPhone,
          url: 'https://kathmanduchilling.com.np/',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '48',
      },
    };

    const faqSchema = item.faqs?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: item.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

    return [breadcrumbs, productSchema, faqSchema].filter(Boolean);
  }, [item]);

  useSeo({
    title: item ? `${item.title} in Nepal | Custom Manufacturing & Price` : 'Product Details',
    description: item
      ? `${item.title} manufacturer in Kathmandu, Nepal. ${item.tagline || item.desc} Sized to your capacity, with 2-year on-site warranty.`
      : 'Explore industrial refrigeration and dairy equipment engineered in Nepal.',
    canonical: item ? `https://kathmanduchilling.com.np/products/${item.slug}` : undefined,
    jsonLd,
  });

  if (!item) return <NotFound />;

  const waLink = buildWhatsAppLink(
    `Hi Kathmandu Chilling, I am inquiring about the ${item.title} (${item.tempTag || 'custom'}). Please provide technical specifications and quotation.`
  );

  // Find related products in same group
  const relatedGroup = PRODUCT_GROUPS.find((g) => g.id === item.categoryId) || PRODUCT_GROUPS[0];
  const relatedProducts = relatedGroup.items.filter((p) => p.slug !== item.slug).slice(0, 3);

  // Print/Download Spec Sheet
  const handlePrintSpecs = () => {
    window.print();
  };

  return (
    <div className="product-detail-page">
      <div className="wrap">
        {/* Breadcrumb Bar */}
        <nav className="p-breadcrumbs mono" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-sep">/</span>
          <Link to="/products">Products</Link>
          <span className="crumb-sep">/</span>
          <span className="current">{item.title}</span>
        </nav>

        {/* Product Hero Header */}
        <div className="p-hero-grid">
          {/* Left Column: 3D Viewer & Multi-Photo Gallery */}
          <div className="p-viewer-col">
            <div className="p-viewer-tabs">
              <button
                className={`p-tab ${activeView === '3d' ? 'active' : ''}`}
                onClick={() => setActiveView('3d')}
              >
                <span className="tab-icon">🧊</span>
                <span>Interactive 3D WebGL Model</span>
              </button>
              <button
                className={`p-tab ${activeView === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveView('gallery')}
              >
                <span className="tab-icon">📸</span>
                <span>High-Res Photo Gallery ({galleryList.length})</span>
              </button>
            </div>

            {activeView === '3d' ? (
              <ThreeProductViewer item={item} />
            ) : (
              <div className="p-gallery-view">
                <div className="p-main-photo-frame">
                  <SmartImage
                    src={galleryList[selectedPhotoIdx]?.url || item.img}
                    alt={galleryList[selectedPhotoIdx]?.caption || item.title}
                    icon={item.icon}
                    ratio="16/10"
                  />
                  <div className="p-photo-caption">
                    <span>{galleryList[selectedPhotoIdx]?.caption || 'Industrial Food-Grade Installation'}</span>
                  </div>
                </div>

                {/* Thumbnails */}
                {galleryList.length > 1 && (
                  <div className="p-thumb-row">
                    {galleryList.map((photo, idx) => (
                      <button
                        key={idx}
                        className={`p-thumb-btn ${selectedPhotoIdx === idx ? 'active' : ''}`}
                        onClick={() => setSelectedPhotoIdx(idx)}
                      >
                        <img src={photo.url} alt={photo.caption} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Title, Quick Specs & Quotation */}
          <div className="p-info-col">
            <div className="p-category-tag mono">
              <span>{item.category || 'Refrigeration System'}</span>
              {item.tempTag && <span className="temp-badge">{item.tempTag}</span>}
            </div>

            <h1>{item.title}</h1>
            <p className="p-tagline">{item.tagline || item.desc}</p>

            <div className="p-quick-metrics">
              <div className="q-metric">
                <span className="q-label">Operating Range</span>
                <strong className="q-val">{item.tempTag || 'Custom'}</strong>
              </div>
              <div className="q-metric">
                <span className="q-label">Insulation / Grade</span>
                <strong className="q-val">{item.specs?.panelThickness?.split(' ')[0] || 'PUF 120mm'}</strong>
              </div>
              <div className="q-metric">
                <span className="q-label">Warranty</span>
                <strong className="q-val">2 Years On-Site</strong>
              </div>
            </div>

            <div className="p-action-box">
              <div className="p-price-note">
                <strong>Custom Engineered &amp; Fabricated in Nepal</strong>
                <span>Direct factory pricing customized to your capacity &amp; facility dimensions.</span>
              </div>
              <div className="p-cta-row">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn whatsapp p-wa-btn">
                  <WhatsAppIcon size={18} /> Instant WhatsApp Engineering Quote
                </a>
                <div className="p-btn-pair">
                  <a href="#quote-form" className="btn solid">
                    Request Formal Quotation
                  </a>
                  <button className="btn btn-outline" onClick={handlePrintSpecs} title="Print Spec Sheet">
                    📄 Print Specs
                  </button>
                </div>
              </div>
              <div className="p-trust-badges">
                <span>✓ On-site Delivery &amp; Erection Across All 7 Provinces of Nepal</span>
                <span>✓ 24/7 Rapid Response Technician Support</span>
                <span>✓ Food Safety &amp; HACCP Compliant Components</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Matrix */}
        <section className="p-section" id="specs">
          <div className="p-section-head">
            <div className="eyebrow">Precision Engineering</div>
            <h2>Full Technical Specifications</h2>
            <p>Built with industrial-grade components tested for Nepal's electrical grid &amp; climatic variations.</p>
          </div>

          <div className="specs-table-wrapper">
            <table className="specs-table">
              <thead>
                <tr>
                  <th>Specification Parameter</th>
                  <th>Engineering Standard / Kathmandu Chilling Build</th>
                </tr>
              </thead>
              <tbody>
                {item.specs &&
                  Object.entries(item.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-name">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </td>
                      <td className="spec-value">{val}</td>
                    </tr>
                  ))}
                {item.dimensions && (
                  <tr>
                    <td className="spec-name">Standard Footprint Dimensions</td>
                    <td className="spec-value">
                      Length: {item.dimensions.length} | Width: {item.dimensions.width} | Height: {item.dimensions.height} (Customizable)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Highlights & Advantages */}
        {item.highlights?.length > 0 && (
          <section className="p-section">
            <div className="p-section-head">
              <div className="eyebrow">Core Advantages</div>
              <h2>Why Kathmandu Chilling Build Quality Excels</h2>
            </div>
            <div className="p-highlights-grid">
              {item.highlights.map((h, i) => (
                <div className="highlight-card" key={i}>
                  <div className="hl-num mono">0{i + 1}</div>
                  <p>{h}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Applications in Nepal */}
        {item.applications?.length > 0 && (
          <section className="p-section">
            <div className="p-section-head">
              <div className="eyebrow">Industry Suitability</div>
              <h2>Applicable Sectors &amp; Use Cases</h2>
            </div>
            <div className="p-apps-chips">
              {item.applications.map((app, i) => (
                <span className="app-chip" key={i}>
                  <span className="chip-icon">🏢</span>
                  <span>{app}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Frequently Asked Questions (FAQ) with Schema backing */}
        {item.faqs?.length > 0 && (
          <section className="p-section p-faq-section">
            <div className="p-section-head">
              <div className="eyebrow">Frequently Asked Questions</div>
              <h2>Answers &amp; Technical Queries</h2>
            </div>
            <div className="p-faq-accordion">
              {item.faqs.map((faq, i) => (
                <details className="faq-item" key={i} open={i === 0}>
                  <summary className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">+</span>
                  </summary>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Quote Form Anchor */}
        <section className="p-section p-form-section" id="quote-form">
          <div className="p-form-card">
            <div className="p-form-text">
              <div className="eyebrow">Get Custom Quotation</div>
              <h2>Configure Your {item.title}</h2>
              <p>
                Tell us your required capacity, available floor space, and location in Nepal. Our senior
                engineer will provide layout drawings and a formal cost breakdown within 24 hours.
              </p>
              <div className="p-direct-call mono">
                <span>Direct Engineering Helpline:</span>
                <strong>9844366008 / 9823821235</strong>
              </div>
            </div>
            <div className="p-form-cta">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn whatsapp btn-large">
                <WhatsAppIcon size={20} /> Open Direct WhatsApp Chat
              </a>
              <Link to="/#contact" className="btn solid btn-large">
                Submit Online RFQ Form
              </Link>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="p-section">
            <div className="p-section-head">
              <div className="eyebrow">Related Solutions</div>
              <h2>Explore More {relatedGroup.title}</h2>
            </div>
            <div className="prod-grid">
              {relatedProducts.map((p) => (
                <div className="card" key={p.slug}>
                  <div className="stage">
                    <SmartImage src={p.img} alt={p.title} icon={p.icon} ratio="4/3" />
                    {p.tempTag && <span className="temp-tag">{p.tempTag}</span>}
                  </div>
                  <div className="card-body">
                    <div className="card-title-row">
                      <span className="card-icon">{p.icon}</span>
                      <h4>{p.title}</h4>
                    </div>
                    <p>{p.desc}</p>
                    <div className="card-actions">
                      <Link className="view" to={`/products/${p.slug}`}>
                        3D View &amp; Specs →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
