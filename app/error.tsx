'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-serif font-bold text-[#2C3E2E] mb-2">Something went wrong</h2>
      <p className="text-sm text-red-600 mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-[#8A9A5B] text-white font-medium rounded-lg hover:bg-[#6C7A45] transition-colors shadow-sm"
      >
        Try again
      </button>
    </div>
  );
}
