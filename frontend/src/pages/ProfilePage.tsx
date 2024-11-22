import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { fetchLogout, fetchUserInfoProfile } from "@/features/UserSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function ProfilePage() {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userInfoProfile = useSelector(
    (state: RootState) => state.user.userInfoProfile
  ).data;
  const userInfoProfileStatus = useSelector(
    (state: RootState) => state.user.userInfoProfileStatus
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfoProfile(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      {userInfoProfileStatus === "loading" ? (
        <p>Loading...</p>
      ) : userInfoProfileStatus === "failed" ? (
        <p>Error</p>
      ) : userInfoProfileStatus === "succeeded" ? (
        <Card className="w-full md:w-[350px]">
          <CardHeader>
            <CardTitle className="mx-auto">
              <Avatar className="w-14 h-14">
                <AvatarImage src="" />
                <AvatarFallback>
                  {userInfoProfile.name
                    ? userInfoProfile.name[0].toUpperCase()
                    : "A"}
                </AvatarFallback>
              </Avatar>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center">
            <p>{userInfoProfile.name}</p>
            <p>{userInfoProfile.email}</p>
          </CardContent>
          <CardFooter className="flex flex-col justify-center items-center space-y-4">
            <div className="p-2 md:p-4 border rounded-lg flex flex-col justify-center items-center ">
              <p>Total Reviews</p>
              <Separator />
              <p>{userInfoProfile.totalReviews}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigate("/profile/update")}
            >
              Update Profile
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => dispatch(fetchLogout())}
            >
              Log Out
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
}

export default ProfilePage;
