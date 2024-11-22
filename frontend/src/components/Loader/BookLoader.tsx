import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BookLoader() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-1/2 h-8" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-[30%] h-3" />
        </CardDescription>
        <CardDescription>
          <Skeleton className="w-[30%] h-3" />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Skeleton className="w-16 h-5" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-24 h-5" />
        </div>
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-[70%] h-5" />
        <div className="flex space-x-1">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-24 h-5" />
        </div>
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-16 h-5" />
        <div className="flex space-x-1">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default BookLoader;
