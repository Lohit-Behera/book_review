import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

function RatingStar({
  value,
  reviews,
  className = "",
  text = false,
}: {
  value: number;
  reviews?: number;
  className?: string;
  text?: boolean;
}) {
  return (
    <div className={cn("flex drop-shadow-md text-amber-400", className)}>
      <span className="mx-[0.1rem] ">
        {value >= 1 ? (
          <Star className="w-5 h-5" fill="currentColor" />
        ) : value >= 0.5 ? (
          <div className="relative">
            <Star className="absolute w-5 h-5" style={{ zIndex: 1 }} />
            <StarHalf fill="currentColor" className="relative w-5 h-5" />
          </div>
        ) : (
          <Star className="w-5 h-5" />
        )}
      </span>
      <span className="drop-shadow-lg mx-[0.1rem]">
        {value >= 2 ? (
          <Star className="w-5 h-5" fill="currentColor" />
        ) : value >= 1.5 ? (
          <div className="relative">
            <Star className="absolute w-5 h-5" style={{ zIndex: 1 }} />
            <StarHalf fill="currentColor" className="relative w-5 h-5" />
          </div>
        ) : (
          <Star className="w-5 h-5" />
        )}
      </span>
      <span className="drop-shadow-lg mx-[0.1rem]">
        {value >= 3 ? (
          <Star className="w-5 h-5" fill="currentColor" />
        ) : value >= 2.5 ? (
          <div className="relative">
            <Star className="absolute w-5 h-5" style={{ zIndex: 1 }} />
            <StarHalf fill="currentColor" className="relative w-5 h-5" />
          </div>
        ) : (
          <Star className="w-5 h-5" />
        )}
      </span>
      <span className="drop-shadow-lg mx-[0.1rem]">
        {value >= 4 ? (
          <Star className="w-5 h-5" fill="currentColor" />
        ) : value >= 3.5 ? (
          <div className="relative">
            <Star className="absolute w-5 h-5" style={{ zIndex: 1 }} />
            <StarHalf fill="currentColor" className="relative w-5 h-5" />
          </div>
        ) : (
          <Star className="w-5 h-5" />
        )}
      </span>
      <span className="drop-shadow-lg mx-[0.1rem]">
        {value >= 5 ? (
          <Star className="w-5 h-5" fill="currentColor" />
        ) : value >= 4.5 ? (
          <div className="relative">
            <Star className="absolute w-5 h-5" style={{ zIndex: 1 }} />
            <StarHalf fill="currentColor" className="relative w-5 h-5" />
          </div>
        ) : (
          <Star className="w-5 h-5" />
        )}
      </span>
      {text && <span className="ml-2 mb-1">Reviews({reviews})</span>}
    </div>
  );
}

export default RatingStar;
