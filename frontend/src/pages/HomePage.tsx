import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { fetchGetAllBooks } from "@/features/BookSlice";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector((state: RootState) => state.book.getAllBooks).data
    .docs;
  const getAllBooksStatus = useSelector(
    (state: RootState) => state.book.getAllBooksStatus
  );
  useEffect(() => {
    dispatch(fetchGetAllBooks());
  }, []);
  return (
    <>
      {getAllBooksStatus === "loading" ? (
        <p>Loading...</p>
      ) : getAllBooksStatus === "failed" ? (
        <p>Error</p>
      ) : getAllBooksStatus === "succeeded" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-[95%] lg:w-[90%]">
          {books?.map((book) => (
            <Card>
              <CardHeader>
                <Link to={`/book/${book?._id}`}>
                  <CardTitle className="text-lg md:text-xl hover:underline">
                    {book?.title}
                  </CardTitle>
                </Link>
                <CardDescription className="text-xs md:text-sm">
                  Author {book?.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm line-clamp-3">
                  {book?.description}
                </p>
              </CardContent>
              <CardFooter>
                <p>Rating {book?.rating}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default HomePage;
