import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.freecashtracker.online';
  const lastModified = new Date();

  return [
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
  ];
}
