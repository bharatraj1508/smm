import Skeleton from "@/components/Common/Skeleton";

const ViewMailSkeleton = () => {
  return (
    <div className="w-full h-full bg-background">
      <div className="px-5 py-6 max-w-[1200px] mx-auto">
        {/* Header Skeleton: Subject, Badge, Button */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-8 w-1/2 md:w-2/3" />
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
        </div>

        {/* Sender Info Row Skeleton */}
        <div className="flex items-start gap-4 mb-8">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56 opacity-60" />
              <Skeleton className="h-3 w-32 opacity-40 ml-auto md:ml-0" />
            </div>
            <Skeleton className="h-4 w-64 opacity-50" />
          </div>
        </div>

        {/* Email Body Content Skeleton */}
        <div className="flex flex-col gap-3 w-full mt-4 animate-pulse">
          <Skeleton className="h-4 w-full opacity-90" />
          <Skeleton className="h-4 w-[92%] opacity-90" />
          <Skeleton className="h-4 w-[96%] opacity-90" />
          <div className="h-4" />
          <Skeleton className="h-4 w-[85%] opacity-90" />
          <Skeleton className="h-4 w-[90%] opacity-90" />
          <Skeleton className="h-4 w-full opacity-90" />
          <div className="h-4" />
          <Skeleton className="h-4 w-[95%] opacity-90" />
          <Skeleton className="h-4 w-[98%] opacity-90" />
        </div>
      </div>
    </div>
  );
};

export default ViewMailSkeleton;
