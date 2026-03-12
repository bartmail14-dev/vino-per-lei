export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--cream)] animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="bg-[var(--warm-white)] border-b border-[var(--sand)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
      {/* Header skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 mx-auto" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
      </div>
      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Products skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
