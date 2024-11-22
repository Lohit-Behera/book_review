import { Skeleton } from "../ui/skeleton";
function ReviewLoader() {
  return (
    <div className="grid gap-4 ">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="grid gap-4 p-2 md:p-4 rounded-md border" key={index}>
          <Skeleton className="h-5 w-full" />
          <div className="flex space-x-1">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewLoader;
