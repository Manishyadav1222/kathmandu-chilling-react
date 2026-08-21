import { Link } from 'react-router-dom';
import { useSeo } from '../../hooks/useSeo';

export default function NotFound() {
  useSeo({
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
  });

  return (
    <section className="blog-page not-found">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">404</div>
          <h1>Page not found</h1>
          <p>
            Sorry, that page has moved or never existed. Head back to the homepage or explore our
            blog.
          </p>
          <div className="cta-actions" style={{ marginTop: 28 }}>
            <Link to="/" className="btn solid">
              Back to Home
            </Link>
            <Link to="/blog" className="btn">
              Read the Blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
