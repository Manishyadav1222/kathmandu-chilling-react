import { Link } from 'react-router-dom';
import { BLOG_POSTS, BLOG_META, formatDate } from '../../data/blog';
import { useSeo } from '../../hooks/useSeo';
import { useReveal } from '../../hooks/useReveal';
import { useAdminData } from '../../context/AdminDataContext.jsx';

export default function BlogList() {
  useSeo({
    title: BLOG_META.defaultTitle,
    description: BLOG_META.defaultDescription,
    canonical: `${BLOG_META.baseUrl}/blog`,
  });
  const headReveal = useReveal();
  const { data } = useAdminData();
  const rawPosts = data?.blogs || BLOG_POSTS;
  const posts = [...rawPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <section className="blog-page">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">From the blog</div>
          <h1>Cold-chain insights for Nepali businesses</h1>
          <p>
            Practical guides on cold storage, dairy equipment and commercial refrigeration — written
            by the engineers who build the machines.
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="blog-card-link">
                <div className="blog-card-media">
                  <img src={post.image} alt={post.imageAlt} loading="lazy" />
                  {post.tags[0] && <span className="blog-tag">{post.tags[0]}</span>}
                </div>
                <div className="blog-card-body">
                  <div className="blog-meta mono">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="blog-read-more">Read the article</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}