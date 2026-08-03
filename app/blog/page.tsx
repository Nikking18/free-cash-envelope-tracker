import React from 'react';
import { BlogIndexClient } from '../../components/BlogIndexClient';

export const metadata = {
  title: 'Cash Envelope Budgeting Guides & Financial Tips | Free Cash Tracker',
  description: 'Explore expert guides on cash envelope budgeting, zero-based budgeting, printable PDF binder ledgers, small business cash flow, and side hustle tracking.',
  keywords: [
    'cash envelope budgeting guide',
    'small business cash flow',
    'side hustle expense tracker',
    'cash stuffing for beginners',
    'printable budget envelope pdf',
    'zero based budgeting tips',
    'multi currency cash tracker',
  ],
  alternates: {
    canonical: 'https://www.freecashtracker.online/blog',
  },
  openGraph: {
    title: 'Cash Envelope Budgeting Guides & Financial Tips | Free Cash Tracker',
    description: 'Master cash envelope budgeting, small business cash flow, and side hustle expense tracking with free digital tools and printable PDF ledgers.',
    url: 'https://www.freecashtracker.online/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  return <BlogIndexClient />;
}
