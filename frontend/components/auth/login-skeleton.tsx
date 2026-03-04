import { Skeleton } from "@/components/ui/skeleton";

export function LoginSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-6 w-40" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="mt-2 h-9 w-24" />
    </div>
  );
}

