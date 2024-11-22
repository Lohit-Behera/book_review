import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  fetchMakeAdmin,
  fetchUpdatePassword,
  fetchUpdateProfile,
  fetchUserInfoProfile,
} from "@/features/UserSlice";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "sonner";
import ServerErrorPage from "./Error/ServerErrorPage";
import GlobalLoader from "@/components/GlobalLoader/GlobalLoader";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be less than 30 characters" }),
  email: z.string().email(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(50, { message: "Password must be less than 50 characters." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ProfileUpdatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userDetails = useSelector(
    (state: RootState) => state.user.userDetails
  ).data;

  const userInfoProfile = useSelector(
    (state: RootState) => state.user.userInfoProfile
  );
  const userInfoProfileStatus = useSelector(
    (state: RootState) => state.user.userInfoProfileStatus
  );
  const makeAdminStatus = useSelector(
    (state: RootState) => state.user.makeAdminStatus
  );

  useEffect(() => {
    dispatch(fetchUserInfoProfile(userDetails._id));
  }, [dispatch, userDetails._id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (userInfoProfileStatus === "succeeded" && userInfoProfile.data) {
      form.reset({
        name: userInfoProfile.data.name || "",
        email: userInfoProfile.data.email || "",
      });
    }
  }, [userInfoProfileStatus, userInfoProfile.data, form]);

  function onSubmitForm(values: z.infer<typeof formSchema>) {
    if (
      values.name === userInfoProfile.data?.name &&
      values.email === userInfoProfile.data?.email
    ) {
      toast.warning("No changes made");
    } else {
      const updateProfilePromise = dispatch(
        fetchUpdateProfile(values)
      ).unwrap();

      toast.promise(updateProfilePromise, {
        loading: "Updating profile...",
        success: (data) => {
          dispatch(fetchUserInfoProfile(userDetails._id));
          return data.message || "Profile updated successfully.";
        },
        error: (error) => {
          return error || error.message || "Error updating profile.";
        },
      });
    }
  }

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    const updatePasswordPromise = dispatch(
      fetchUpdatePassword(values)
    ).unwrap();
    toast.promise(updatePasswordPromise, {
      loading: "Updating password...",
      success: (data) => {
        dispatch(fetchUserInfoProfile(userDetails._id));
        return data.message || "Password updated successfully.";
      },
      error: (error) => {
        return error || error.message || "Error updating password.";
      },
    });
  }

  const handleAdmin = () => {
    const adminPromise = dispatch(fetchMakeAdmin()).unwrap();
    toast.promise(adminPromise, {
      loading: "Making admin...",
      success: (data) => {
        dispatch(fetchUserInfoProfile(userDetails._id));
        return data.message || "Admin made successfully.";
      },
      error: (error) => {
        return error || error.message || "Error making admin.";
      },
    });
  };

  return (
    <>
      {userInfoProfileStatus === "loading" ? (
        <GlobalLoader />
      ) : userInfoProfileStatus === "failed" ? (
        <ServerErrorPage />
      ) : userInfoProfileStatus === "succeeded" ? (
        <Card className="w-full md:w-[90%] lg:w-[80%]">
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4">
              <p>This is for testing purposes make yourself Admin</p>
              <Button size="sm" onClick={handleAdmin}>
                {makeAdminStatus === "loading" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : userInfoProfile.data.isAdmin ? (
                  "Remove Admin"
                ) : (
                  "Make Admin"
                )}
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="sm">
                  Update
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="grid gap-4">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                className="space-y-6 w-full"
              >
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your old password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your confirm password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="sm">
                  Update Password
                </Button>
              </form>
            </Form>
            <Button type="button" size="sm" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
}

export default ProfileUpdatePage;
