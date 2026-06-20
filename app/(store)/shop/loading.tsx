export default function ShopLoading() {
  return (
    <div className="page-enter">
      {/* Header Skeleton */}
      <section className="bg-brand-cream pb-16 pt-32 lg:pb-20 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto h-3 w-24 rounded bg-brand-wood/10 animate-pulse" />
          <div className="mx-auto mt-4 h-12 w-48 rounded bg-brand-wood/10 animate-pulse" />
          <div className="mx-auto mt-6 h-4 w-64 rounded bg-brand-wood/10 animate-pulse" />
          <div className="mx-auto mt-8 h-12 max-w-md rounded-full bg-brand-wood/10 animate-pulse" />
        </div>
      </section>

      {/* Categories & Products Skeleton */}
      <section className="bg-brand-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full bg-brand-wood/10 animate-pulse"
              />
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square w-full rounded-sm bg-brand-wood/10 animate-pulse" />
                <div className="h-4 w-1/3 rounded bg-brand-wood/10 animate-pulse" />
                <div className="h-5 w-2/3 rounded bg-brand-wood/10 animate-pulse" />
                <div className="h-4 w-1/4 rounded bg-brand-wood/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
