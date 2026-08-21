import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BLOG_META, getPostBySlug, getRelatedPosts, formatDate } from '../../data/blog';
import { CONTACT, buildWhatsAppLink } from '../../data/content';
import { useAdminData } from '../../context/AdminDataContext.jsx';
import { useSeo } from '../../hooks/useSeo';
import { useReveal } from '../../hooks/useReveal';
import { WhatsAppIcon } from '../Hero.jsx';
import NotFound from './NotFound.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { data } = useAdminData();
  const allBlogs = data?.blogs || [];
  const post = allBlogs.find((b) => b.slug === slug) || getPostBySlug(slug);
  const reveal = useReveal();

  const jsonLd = useMemo(() => {
    if (!post) return null;

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kathmanduchilling.com.np/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://kathmanduchilling.com.np/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${BLOG_META.baseUrl}/blog/${post.slug}` },
      ],
    };

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${BLOG_META.baseUrl}/blog/${post.slug}` },
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: post.authorRole || 'Refrigeration Engineer',
        worksFor: {
          '@type': 'Organization',
          name: 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.',
        logo: { '@type': 'ImageObject', url: CONTACT.logo },
      },
      keywords: post.tags.join(', '),
      articleBody: post.aiSummary?.keyTakeaway || post.excerpt,
    };

    const faqSchema = post.faqs?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

    return [breadcrumbs, articleSchema, faqSchema].filter(Boolean);
  }, [post]);

  useSeo({
    title: post?.metaTitle || post?.title,
    description: post?.metaDescription || post?.excerpt,
    canonical: post ? `${BLOG_META.baseUrl}/blog/${post.slug}` : undefined,
    jsonLd,
  });

  if (!post) return <NotFound />;

  const related = getRelatedPosts(post, 2);
  const waLink = buildWhatsAppLink(
    `Hi Kathmandu Chilling, I just read "${post.title}" on your website and would like to discuss equipment for our facility.`
  );

  return (
    <article className="blog-post">
      <div className="wrap">
        <div className="blog-post-inner">
          <Link to="/blog" className="blog-back mono">
            ← Back to All Guides
          </Link>

          <div className="blog-post-head">
            <div className="blog-meta mono">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
              <span>·</span>
              <span className="blog-author-tag">By {post.author}</span>
            </div>
            <h1>{post.title}</h1>
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag static">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="blog-cover-wrapper">
            <img src={post.image} alt={post.imageAlt} className="blog-cover" loading="eager" />
          </div>

          {/* AI Search Engine Executive Summary Box (GEO Optimized) */}
          {post.aiSummary && (
            <div className="ai-summary-box" data-ai-summary="true">
              <div className="ai-summary-head">
                <span className="ai-icon">✨</span>
                <strong>AI Executive Summary &amp; Key Takeaway</strong>
              </div>
              <p className="ai-takeaway">{post.aiSummary.keyTakeaway}</p>
              {post.aiSummary.quickFacts?.length > 0 && (
                <div className="ai-facts-grid">
                  {post.aiSummary.quickFacts.map((fact, idx) => (
                    <div className="ai-fact-pill" key={idx}>
                      <span className="ai-fact-label">{fact.label}:</span>
                      <strong className="ai-fact-val">{fact.val}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="blog-article reveal" ref={reveal}>
            {/* Main Sections */}
            {post.sections.map((section, i) => (
              <div className="blog-section" key={i}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
                {section.list?.length > 0 && (
                  <ul>
                    {section.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Comparison Table if Present */}
            {post.comparisonTable && (
              <div className="blog-comparison-wrapper">
                <h3>{post.comparisonTable.title}</h3>
                <div className="table-responsive">
                  <table className="blog-comparison-table">
                    <thead>
                      <tr>
                        {post.comparisonTable.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {post.comparisonTable.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className={j === 0 ? 'row-metric' : ''}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {post.faqs?.length > 0 && (
              <div className="blog-faqs-section">
                <h2>Frequently Asked Technical Questions</h2>
                <div className="blog-faq-accordion">
                  {post.faqs.map((faq, i) => (
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
              </div>
            )}

            {/* Author Credibility Card */}
            <div className="author-card">
              <div className="author-avatar mono">KT</div>
              <div className="author-info">
                <strong>{post.author}</strong>
                <span>{post.authorRole || 'Refrigeration Engineering Specialist'}</span>
                <p>
                  Industrial cooling design specialist with extensive field experience across Nepal’s
                  high-altitude, valley, and Terai refrigeration plants.
                </p>
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="blog-cta">
              <h2>Need a Custom Cooling or Dairy Solution?</h2>
              <p>
                Tell us about your operational requirements — capacity, target temperature range, and
                facility location — and our engineering team will provide tailored layout designs and
                quotations.
              </p>
              <div className="cta-actions">
                <Link to="/#contact" className="btn solid">
                  Request a Formal Quote
                </Link>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn whatsapp"
                >
                  <WhatsAppIcon /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="blog-related">
              <h2>Keep Reading</h2>
              <div className="blog-grid">
                {related.map((p) => (
                  <article className="blog-card" key={p.slug}>
                    <Link to={`/blog/${p.slug}`} className="blog-card-link">
                      <div className="blog-card-media">
                        <img src={p.image} alt={p.imageAlt} loading="lazy" />
                        {p.tags[0] && <span className="blog-tag">{p.tags[0]}</span>}
                      </div>
                      <div className="blog-card-body">
                        <div className="blog-meta mono">
                          <span>{formatDate(p.date)}</span>
                          <span>·</span>
                          <span>{p.readingTime} min read</span>
                        </div>
                        <h3>{p.title}</h3>
                        <span className="blog-read-more">Read the guide →</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}