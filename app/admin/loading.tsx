import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-brand-dark dark:text-brand-light">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm tracking-wide">Loading dashboard data...</p>
    </div>
  );
}
