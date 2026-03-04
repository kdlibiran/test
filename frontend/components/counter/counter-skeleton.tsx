import { Skeleton } from "@/components/ui/skeleton";

export function CounterSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-24 w-24 rounded-full" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  );
}

