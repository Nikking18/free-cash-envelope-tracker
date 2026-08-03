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

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `https://www.freecashtracker.online/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: `https://www.freecashtracker.online/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Schema.org Article Structured Data for Google rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishDate,
    publisher: {
      '@type': 'Organization',
      name: 'Free Cash Envelope Tracker',
      url: 'https://www.freecashtracker.online',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.freecashtracker.online/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
