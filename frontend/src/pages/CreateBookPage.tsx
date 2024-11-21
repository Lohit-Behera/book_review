import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { ArrowLeft, SquarePlus, X } from "lucide-react";
import { fetchCreateBook } from "@/features/BookSlice";
import { toast } from "sonner";

const createBookSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters",
    })
    .max(50, {
      message: "Title must be less than 50 characters",
    }),
  author: z
    .string()
    .min(3, {
      message: "Author must be at least 3 characters",
    })
    .max(30, {
      message: "Author must be less than 30 characters",
    }),
  genre: z.array(z.string()).min(1, {
    message: "At least one genre is required",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .max(500, {
      message: "Description must be less than 500 characters",
    }),
});

function CreateBookPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userDetails = useSelector(
    (state: RootState) => state.user.userDetails
  ).data;

  const [newGenre, setNewGenre] = useState("");

  const form = useForm<z.infer<typeof createBookSchema>>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: [],
      description: "",
    },
  });

  const addGenre = () => {
    const currentGenres = form.getValues("genre");
    if (
      newGenre.trim() &&
      currentGenres.length < 10 &&
      !currentGenres.includes(newGenre.trim().toLowerCase())
    ) {
      const updatedGenres = [...currentGenres, newGenre.trim().toLowerCase()];
      form.setValue("genre", updatedGenres);
      setNewGenre("");
    }
  };

  const removeGenre = (index: number) => {
    const currentGenres = form.getValues("genre");
    const updatedGenres = currentGenres.filter((_, i) => i !== index);
    form.setValue("genre", updatedGenres);
  };

  function onSubmit(values: z.infer<typeof createBookSchema>) {
    const data = {
      title: values.title,
      author: values.author,
      genre: values.genre,
      description: values.description,
      createdBy: userDetails._id,
    };
    const createBookPromise = dispatch(fetchCreateBook(data)).unwrap();
    toast.promise(createBookPromise, {
      loading: "Creating book...",
      success: (data) => {
        toast.success("Book created successfully");
        navigate(`/book/${data.data.id}`);
        return data._id;
      },
      error: (error) => {
        toast.error(error.message);
        return error.message;
      },
    });
  }
  return (
    <Card className="w-full md:w-[90%] lg:w-[80%]">
      <CardHeader>
        <CardTitle>Create Book</CardTitle>
        <CardDescription>Create a new book</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={() => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add a genre"
                          value={newGenre}
                          onChange={(e) => {
                            e.preventDefault();
                            setNewGenre(e.target.value);
                          }}
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          type="button"
                          onClick={addGenre}
                        >
                          <SquarePlus className="w-10 h-10" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {form.getValues("genre").map((genre, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between space-x-2 p-1 pl-2 rounded-md border"
                          >
                            <span className="text-sm">{genre}</span>
                            <span
                              className="cursor-pointer"
                              onClick={() => removeGenre(index)}
                            >
                              <X className="w-5 h-5" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-y"
                      rows={8}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button className="w-full" type="submit">
                Submit
              </Button>
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default CreateBookPage;
