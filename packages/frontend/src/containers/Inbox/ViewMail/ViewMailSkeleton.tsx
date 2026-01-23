import Skeleton from "@/components/Common/Skeleton";

const ViewMailSkeleton = () => {
  return (
    <div className="flex justify-center items-center w-[80vw] mt-10">
      <div className="w-full max-w-3xl border border-gray-200 rounded-xl bg-white shadow-lg p-8">
        <div className="flex items-start w-full gap-3">
          {/* Avatar Skeleton */}
          <Skeleton className="w-13 h-13 rounded-full shrink-0" />

          <div className="flex items-start justify-center flex-col gap-4 w-full">
            <div className="w-full flex justify-between items-start">
              <div className="flex flex-col gap-2 mt-1.5">
                {/* From Name & Email */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40 opacity-60" />
                </div>
                {/* To Recipient */}
                <Skeleton className="h-3 w-48" />
              </div>
              {/* Button Skeleton */}
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>

            {/* Category Badge & Reason */}
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-3 w-64" />
            </div>

            {/* Subject Line */}
            <Skeleton className="h-8 w-3/4 mt-4 mb-6" />

            {/* Email Body Content */}
            <div className="flex flex-col gap-4 w-full mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-[88%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMailSkeleton;
