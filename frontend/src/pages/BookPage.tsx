import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGetBook } from "@/features/BookSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RatingStar from "@/components/RatingStar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { toast } from "sonner";
import { fetchCreateReview, fetchGetReviews } from "@/features/ReviewSlice";

function BookPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const book = useSelector((state: RootState) => state.book.getBook).data;

  const reviews = useSelector(
    (state: RootState) => state.review.getReviews
  ).data;

  useEffect(() => {
    if (bookId) {
      dispatch(fetchGetBook(bookId));
      dispatch(fetchGetReviews(bookId));
    }
  }, [bookId]);

  const handleReviewSubmit = () => {
    if (review.length < 5) {
      toast.warning("Review must be at least 5 characters long.");
    } else if (rating === 0) {
      toast.warning("Please select a rating.");
    } else if (bookId) {
      const createReviewPromise = dispatch(
        fetchCreateReview({ rating, review, bookId })
      ).unwrap();
      toast.promise(createReviewPromise, {
        loading: "Creating review...",
        success: (data: any) => {
          return data.message;
        },
        error: "Error creating review.",
      });
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-6 w-6 cursor-pointer ${
            i <= rating ? "fill-primary stroke-primary" : "stroke-primary"
          }`}
          onClick={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  return (
    <Card className="w-full md:w-[90%] lg:w-[80%]">
      <CardHeader>
        <CardTitle>{book?.title}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Created by {book?.createdBy}
        </CardDescription>
        <CardDescription className="text-xs md:text-sm">
          Created at {book?.createdAt}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm md:text-base">{book?.description}</p>
        <RatingStar value={book?.rating} reviews={5} text />
      </CardContent>
      <CardFooter className="grid gap-4">
        <div className="grid gap-2">
          <p className="text-base md:text-lg font-semibold">Leave a review</p>
          <Textarea
            placeholder="Write your review here"
            rows={6}
            className="w-full"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="grid gap-2">
            <div className="flex items-center gap-1 text-sm md:text-base">
              Rating {renderStars()}
            </div>
            <Button size="sm" onClick={handleReviewSubmit}>
              Submit
            </Button>
          </div>
        </div>
        {reviews.docs.length === 0 ? (
          <p className="text-sm md:text-base">No reviews yet</p>
        ) : reviews.docs.length > 0 ? (
          <>
            {reviews.docs.map((review) => (
              <div className="grid gap-2 p-2 md:p-4 border rounded-md">
                <p className="text-sm md:text-base">{review.review}</p>
                <RatingStar value={review.rating} reviews={5} text />
              </div>
            ))}
          </>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default BookPage;