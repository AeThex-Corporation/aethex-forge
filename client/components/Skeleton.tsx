import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "avatar" | "card" | "button" | "image";
  lines?: number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "text",
  lines = 1,
  animate = true,
}: SkeletonProps) {
  const baseClasses = cn("bg-muted rounded", animate && "skeleton", className);

  switch (variant) {
    case "avatar":
      return <div className={cn(baseClasses, "h-12 w-12 rounded-full")} />;

    case "button":
      return <div className={cn(baseClasses, "h-10 w-24")} />;

    case "image":
      return <div className={cn(baseClasses, "h-48 w-full")} />;

    case "card":
      return (
        <div className={cn("space-y-3 p-4 border rounded-lg", className)}>
          <div className={cn(baseClasses, "h-6 w-3/4")} />
          <div className={cn(baseClasses, "h-4 w-full")} />
          <div className={cn(baseClasses, "h-4 w-2/3")} />
        </div>
      );

    case "text":
    default:
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                "h-4",
                i === lines - 1 ? "w-2/3" : "w-full",
              )}
            />
          ))}
        </div>
      );
  }
}

export function SkeletonCard() {
  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center space-y-3">
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonUserPath() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonOnboardingStep() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 border-2 border-border/50 rounded-lg space-y-2"
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Skeleton variant="button" className="w-20" />
        <Skeleton variant="button" className="w-24" />
      </div>
    </div>
  );
}

export function SkeletonLayout() {
  return (
    <div className="min-h-screen bg-aethex-gradient">
      {/* Header Skeleton */}
      <div className="border-b border-border/40 bg-background/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton variant="button" />
            <Skeleton variant="button" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-20">
        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            <div className="flex justify-center space-x-4">
              <Skeleton variant="button" className="w-32 h-12" />
              <Skeleton variant="button" className="w-32 h-12" />
            </div>
          </div>

          <SkeletonStats />
          <SkeletonUserPath />
        </div>
      </div>
    </div>
  );
}
