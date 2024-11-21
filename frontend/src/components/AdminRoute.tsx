import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const userDetailsStatus = useSelector(
    (state: any) => state.user.userDetailsStatus
  );
  const userDetailsData = userDetails.data || {};

  useEffect(() => {
    if (!userInfo || userDetailsStatus === "succeeded") {
      if (!userDetailsData.isAdmin) {
        navigate("/sign-in");
      }
    }
  }, [userDetailsStatus, userInfo, navigate]);

  return userDetailsStatus === "succeeded"
    ? userInfo && userDetailsData.isAdmin
      ? children
      : null
    : null;
};

export default AdminRoute;
