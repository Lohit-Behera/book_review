import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { fetchUserDetails } from "./features/UserSlice";
import { useEffect } from "react";

function Layout() {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state: RootState) => state.user.userDetailsStatus
  );
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails());
    }
  }, []);

  return (
    <div className="min-h-[100vh] flex flex-col">
      {userDetailsStatus === "loading" ? (
        <p>Loading...</p>
      ) : userDetailsStatus === "failed" ? (
        <p>Error</p>
      ) : userDetailsStatus === "succeeded" ? (
        <>
          <Header />
          <main className="flex-1 flex justify-center items-center">
            <ScrollRestoration />
            <Outlet />
          </main>
        </>
      ) : null}
    </div>
  );
}

export default Layout;
