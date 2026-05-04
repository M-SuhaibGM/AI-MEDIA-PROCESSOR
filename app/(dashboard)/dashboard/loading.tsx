// app/dashboard/loading.tsx
export default function Loading() {
  // You can create a custom skeleton loader here
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
      <div className="h-64 w-full bg-gray-100 animate-pulse rounded" />
    </div>
  );
}