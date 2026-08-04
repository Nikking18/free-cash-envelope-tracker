import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '../lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.freecashtracker.online';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          es: `${baseUrl}?lang=es`,
          fr: `${baseUrl}?lang=fr`,
          de: `${baseUrl}?lang=de`,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}?lang=es`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}?lang=fr`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}?lang=de`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
