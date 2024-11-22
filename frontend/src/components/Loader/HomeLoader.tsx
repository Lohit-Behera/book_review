import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function HomeLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-[95%] lg:w-[90%]">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-[50%] h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-[70%] h-3" />
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Skeleton className="w-[95%] h-3" />
            <Skeleton className="w-[85%] h-3" />
            <Skeleton className="w-[90%] h-3" />
          </CardContent>
          <CardFooter className="flex space-x-1">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default HomeLoader;
