export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--cream)] animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[70vh] bg-gray-200" />
      {/* Categories skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 mx-auto" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Featured products skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
