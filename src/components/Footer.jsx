import { Link } from 'react-router-dom';
import { CONTACT } from '../data/content';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  const { data } = useAdminData();
  const contact = data?.contact || CONTACT;

  const phone1 = contact.phone1 || contact.primaryPhone || '9844366008';
  const phone2 = contact.phone2 || (contact.phones && contact.phones[1]) || '9823821235';
  const email = contact.email || 'contact@kathmanduchilling.com.np';
  const address = contact.location || contact.address || 'Chandragiri-14, Naya Naikap, Kathmandu, Nepal';

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img src={contact.logo || CONTACT.logo} alt="Kathmandu Chilling KCR logo" />
            </div>
            <div className="footer-brand-title">
              <strong>Kathmandu Chilling</strong>
              <span>Cooling &amp; Dairy Systems</span>
            </div>
            <p>
              Leading cooling and dairy processing equipment manufacturer in Nepal. Custom-engineered
              cold storage rooms, bulk milk coolers, blast freezers, and turnkey dairy plants.
            </p>
          </div>
          <div>
            <h5>Quick Navigation</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products &amp; Machinery</Link></li>
              <li><Link to="/about">🏛️ Our Story &amp; Team</Link></li>
              <li><Link to="/calculator">⚡ Sizing &amp; ROI Calculator</Link></li>
              <li><Link to="/technology">Technology &amp; Inverter Edge</Link></li>
              <li><Link to="/projects">Completed Projects</Link></li>
              <li><Link to="/sectors">Industries Served</Link></li>
              <li><Link to="/why-us">Why Choose KCR</Link></li>
              <li><Link to="/promotions">Campaigns &amp; Expos</Link></li>
              <li><Link to="/blog">Engineering Blog</Link></li>
              <li><Link to="/contact">Get Quotation</Link></li>
            </ul>
          </div>
          <div>
            <h5>3D Products &amp; Specs</h5>
            <ul>
              <li><Link to="/products/cold-room">Cold Storage Rooms</Link></li>
              <li><Link to="/products/chilling-vats">Milk Chilling VATs (BMC)</Link></li>
              <li><Link to="/products/dairy-plant">Turnkey Dairy Plants</Link></li>
              <li><Link to="/products/blast-chiller">Shock Blast Chillers</Link></li>
              <li><Link to="/products/walk-in-freezer">Walk-in Freezers</Link></li>
              <li><Link to="/products/road-milk-tanker">Road Milk Tankers</Link></li>
            </ul>
          </div>
          <div>
            <h5>Direct Contact</h5>
            <ul>
              <li>📍 {address}</li>
              <li><a href={`tel:${phone1}`}>📞 +977 {phone1}</a></li>
              {phone2 && <li><a href={`tel:${phone2}`}>📞 +977 {phone2}</a></li>}
              <li><a href={`mailto:${email}`}>✉️ {email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} {contact.name || 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.'} All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Smart Cooling, Reliable Cold Chains · Made in Nepal.</span>
            <Link to="/admin/login" style={{ color: 'var(--steel-dim)', fontSize: '11px', textDecoration: 'none' }} className="mono">
              🔒 Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
