import React from 'react';
import { BlogIndexClient } from '../../components/BlogIndexClient';
import { BLOG_POSTS } from '../../lib/blog-data';

export const metadata = {
  title: 'Cash Envelope Budgeting Guides & Financial Masterclasses | Free Cash Tracker',
  description: 'Explore 25+ expert guides on cash envelope budgeting, zero-based budgeting, printable PDF binder ledgers, small business cash flow, debt payoff, and side hustle tracking.',
  keywords: [
    'cash envelope budgeting guide',
    'small business cash flow',
    'side hustle expense tracker',
    'cash stuffing for beginners',
    'printable budget envelope pdf',
    'zero based budgeting tips',
    'multi currency cash tracker',
    'goodbudget alternative blog',
    'ynab alternative guides',
    'debt snowball vs debt avalanche',
    'sinking funds guide 2026',
  ],
  alternates: {
    canonical: 'https://www.freecashtracker.online/blog',
  },
  openGraph: {
    title: 'Cash Envelope Budgeting Guides & Financial Masterclasses | Free Cash Tracker',
    description: 'Master cash envelope budgeting, small business cash flow, debt snowball, and side hustle expense tracking with free digital tools and printable PDF ledgers.',
    url: 'https://www.freecashtracker.online/blog',
    type: 'website',
    images: [
      {
        url: 'https://www.freecashtracker.online/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cash Envelope Budgeting Masterclasses — Free Cash Envelope Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cash Envelope Budgeting Guides & Financial Masterclasses',
    description: 'Master cash envelope budgeting, debt payoff, and small business cash flow with free guides.',
    images: ['https://www.freecashtracker.online/og-image.png'],
  },
};

export default function BlogIndexPage() {
  const jsonLdCatalog = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cash Envelope Budgeting Guides & Financial Masterclasses',
    description: 'Explore expert guides on cash envelope budgeting, zero-based budgeting, debt payoff strategies, and side hustle tracking.',
    url: 'https://www.freecashtracker.online/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: BLOG_POSTS.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.freecashtracker.online/blog/${post.slug}`,
        name: post.title,
        description: post.summary,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCatalog) }}
      />
      <BlogIndexClient />
    </>
  );
}
