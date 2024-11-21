import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
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

function BookPage() {
  const { bookId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const book = useSelector((state: RootState) => state.book.getBook).data;
  useEffect(() => {
    if (bookId) {
      dispatch(fetchGetBook(bookId));
    }
  }, [bookId]);

  return (
    <Card className="w-full md:w-[90%] lg:w-[80%]">
      <CardHeader>
        <CardTitle>{book?.title}</CardTitle>
        <CardDescription>Created by {book?.createdBy}</CardDescription>
        <CardDescription>Created at {book?.createdAt}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p>{book?.description}</p>
        <p>Rating {book?.rating}</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

export default BookPage;
