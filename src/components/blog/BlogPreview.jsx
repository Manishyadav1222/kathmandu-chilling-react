import { Link } from 'react-router-dom';
import { getLatestPosts, formatDate } from '../../data/blog';
import { useReveal } from '../../hooks/useReveal';
import { useAdminData } from '../../context/AdminDataContext.jsx';
import SmartImage from '../SmartImage.jsx';

export default function BlogPreview() {
  const headReveal = useReveal();
  const { data } = useAdminData();
  const rawList = data?.blogs && data.blogs.length > 0 ? data.blogs : getLatestPosts(3);
  const posts = rawList.slice(0, 3);

  return (
    <section id="blog">
      <div className="wrap">
        <div
          className="section-head reveal"
          ref={headReveal}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            maxWidth: '100%',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div className="eyebrow">Latest from the blog</div>
            <h2>Cold-chain guides for Nepali businesses</h2>
            <p>Practical articles on cold storage, dairy equipment and commercial refrigeration.</p>
          </div>
          <Link to="/blog" className="btn">
            All Articles →
          </Link>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.slug || post.id}>
              <Link to={`/blog/${post.slug || post.id}`} className="blog-card-link">
                <div className="blog-card-media">
                  <SmartImage
                    src={post.image || post.img}
                    alt={post.imageAlt || post.title}
                    icon="📖"
                    ratio="16/10"
                  />
                  {(post.tags?.[0] || post.category) && (
                    <span className="blog-tag">{post.tags?.[0] || post.category}</span>
                  )}
                </div>
                <div className="blog-card-body">
                  <div className="blog-meta mono">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{post.readingTime || post.readTime || 5} min read</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-read-more">Read the article →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}