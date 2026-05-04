// app/dashboard/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // Log the error to a service like Sentry
  }, [error]);

  return (
    <div className="p-4 border-2 border-red-500 rounded-lg bg-red-50">
      <h2 className="text-xl font-bold text-red-700">Something went wrong!</h2>
      <button
        onClick={() => reset()} // Try to re-render the segment
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}