import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-serif font-bold text-[#2C3E2E] mb-2">404 — Page Not Found</h1>
      <p className="text-[#556B2F] mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-[#8A9A5B] text-white font-medium rounded-lg hover:bg-[#6C7A45] transition-colors shadow-sm"
      >
        Back to Cash Envelope Tracker
      </Link>
    </div>
  );
}
