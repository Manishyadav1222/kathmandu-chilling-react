import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  // items: [{ label: 'Products', to: '/products' }, { label: 'Cold Storage Room' }]
  const baseUrl = 'https://kathmanduchilling.com.np';

  const schemaItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      item: item.to ? `${baseUrl}${item.to}` : undefined,
    })),
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="page-breadcrumb-nav">
        <div className="wrap">
          <ol className="breadcrumb-list mono">
            <li className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link home-link">
                <span className="breadcrumb-home-icon">🏠</span>
                <span>Home</span>
              </Link>
            </li>
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <li key={idx} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                  <span className="breadcrumb-separator">/</span>
                  {item.to && !isLast ? (
                    <Link to={item.to} className="breadcrumb-link">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="breadcrumb-current">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
