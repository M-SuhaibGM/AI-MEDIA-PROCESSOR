// app/dashboard/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold">404 - Dashboard Not Found</h2>
      <p className="text-gray-600 mt-2">Could not find the requested resource.</p>
      <Link href="/dashboard" className="text-blue-500 underline mt-4 inline-block">
        Return to Dashboard Home
      </Link>
    </div>
  );
}