import React from 'react';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPostBySlug } from '../../../lib/blog-data';
import { BlogPostClient } from '../../../components/BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Free Cash Envelope Tracker',
    };
  }

  const postUrl = `https://www.freecashtracker.online/blog/${post.slug}`;
  const ogImageUrl = `https://www.freecashtracker.online/og-image.png`;

  return {
    title: `${post.seoTitle} | Free Cash Envelope Tracker`,
    description: post.metaDescription,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    publisher: 'Free Cash Envelope Tracker',
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.publishDate,
      authors: [post.author],
      section: post.category,
      tags: post.keywords,
      siteName: 'Free Cash Envelope Tracker',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} — Free Cash Envelope Tracker`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `https://www.freecashtracker.online/blog/${post.slug}`;

  // Schema.org Article Structured Data for Google rich snippets
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: ['https://www.freecashtracker.online/og-image.png'],
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://www.freecashtracker.online',
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    articleSection: post.category,
    keywords: post.keywords.join(', '),
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Free Cash Envelope Tracker',
      url: 'https://www.freecashtracker.online',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.freecashtracker.online/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  // Schema.org BreadcrumbList for Search Engine Result Pages (SERP)
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.freecashtracker.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.freecashtracker.online/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category,
        item: 'https://www.freecashtracker.online/blog',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
