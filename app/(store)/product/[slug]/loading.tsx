export default function ProductLoading() {
  return (
    <div className="page-enter bg-brand-light pb-16 pt-28 lg:pb-24 lg:pt-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-3 w-16 animate-pulse rounded bg-brand-wood/10" />
          <span className="text-brand-wood/20">/</span>
          <div className="h-3 w-16 animate-pulse rounded bg-brand-wood/10" />
          <span className="text-brand-wood/20">/</span>
          <div className="h-3 w-32 animate-pulse rounded bg-brand-wood/20" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Skeleton */}
          <div className="relative aspect-square w-full animate-pulse overflow-hidden rounded-sm bg-brand-wood/5" />

          {/* Details Skeleton */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <div className="mb-4 h-3 w-20 animate-pulse rounded bg-brand-wood/10" />
            
            {/* Title */}
            <div className="mb-2 h-10 w-3/4 animate-pulse rounded bg-brand-wood/15" />
            <div className="h-10 w-1/2 animate-pulse rounded bg-brand-wood/15" />
            
            {/* Price */}
            <div className="mt-6 h-8 w-1/3 animate-pulse rounded bg-brand-wood/10" />
            
            {/* Description */}
            <div className="mt-8 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-brand-wood/5" />
              <div className="h-4 w-full animate-pulse rounded bg-brand-wood/5" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-brand-wood/5" />
            </div>

            {/* CTAs */}
            <div className="mt-12 space-y-3">
              <div className="h-14 w-full animate-pulse rounded-full bg-brand-wood/10" />
              <div className="h-14 w-full animate-pulse rounded-full border border-brand-wood/10 bg-transparent" />
            </div>

            {/* Accordion Skeletons */}
            <div className="mt-12 space-y-4 border-t border-brand-wood/10 pt-8">
              <div className="h-12 w-full animate-pulse rounded bg-brand-wood/5" />
              <div className="h-12 w-full animate-pulse rounded bg-brand-wood/5" />
              <div className="h-12 w-full animate-pulse rounded bg-brand-wood/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
