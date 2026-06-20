export default function StoreLoading() {
  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center bg-brand-light">
      <div className="flex flex-col items-center gap-4">
        {/* Animated brand element */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-[1px] border-dashed border-brand-gold/50" />
          <div className="absolute inset-2 animate-[spin_2s_linear_infinite_reverse] rounded-full border-t-2 border-brand-wood" />
          <div className="h-2 w-2 rounded-full bg-brand-gold" />
        </div>
        
        {/* Loading text */}
        <p className="font-serif text-xs tracking-[0.2em] text-brand-wood animate-pulse">
          MEMUAT...
        </p>
      </div>
    </div>
  );
}
