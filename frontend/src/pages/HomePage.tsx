import { Link, useSearchParams } from "react-router-dom";
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
import RatingStar from "@/components/RatingStar";
import Paginator from "@/components/paginator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServerErrorPage from "./Error/ServerErrorPage";
import HomeLoader from "@/components/Loader/HomeLoader";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  let [searchParams, setSearchParams] = useSearchParams();

  const books = useSelector((state: RootState) => state.book.getAllBooks) || {};
  const booksData = books.data || {};
  const booksList = booksData.docs || [];
  const getAllBooksStatus = useSelector(
    (state: RootState) => state.book.getAllBooksStatus
  );

  const handleSortChange = (value: string) => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setSearchParams({ sortBy: value });
    dispatch(fetchGetAllBooks({ sortBy: value, page }));
  };

  useEffect(() => {
    const params = {
      sortBy: searchParams.get("sortBy") || "reviews",
      page: parseInt(searchParams.get("page") || "1", 10),
    };
    dispatch(fetchGetAllBooks(params));
  }, [searchParams]);

  return (
    <>
      {getAllBooksStatus === "loading" ? (
        <HomeLoader />
      ) : getAllBooksStatus === "failed" ? (
        <ServerErrorPage />
      ) : getAllBooksStatus === "succeeded" ? (
        <>
          {booksList?.length === 0 ? (
            <p className="text-base md:text-lg font-semibold">No book found</p>
          ) : (
            <div className="grid gap-4 w-full md:w-[95%] lg:w-[90%]">
              <div className="flex justify-end mb-4">
                <Select
                  value={searchParams.get("sortBy") || "reviews"}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort" defaultValue={"reviews"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviews">Highest Reviews</SelectItem>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {booksList?.map((book) => (
                  <Card key={book?._id}>
                    <CardHeader>
                      <Link to={`/book/${book?._id}`}>
                        <CardTitle className="text-lg md:text-xl line-clamp-1 hover:underline">
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
                      <RatingStar
                        value={book?.averageRating}
                        reviews={book?.totalReview}
                      />
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div>
                {booksList.length > 0 && (
                  <Paginator
                    currentPage={booksData.page}
                    totalPages={booksData.totalPages}
                    showPreviousNext
                  />
                )}
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

export default HomePage;
