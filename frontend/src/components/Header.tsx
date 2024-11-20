import { fetchLogout } from "@/features/UserSlice";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    const logoutUserPromise = dispatch(fetchLogout()).unwrap();
    toast.promise(logoutUserPromise, {
      loading: "Logging out...",
      success: (data: any) => {
        navigate("/login");
        return data.message || "Logout successful";
      },
      error: (error: any) => {
        return error || error.message || "Logout failed";
      },
    });
  };
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50 shadow  ">
      <nav className="hidden md:flex justify-between space-x-2">
        <div className="w-full flex justify-between">
          <p>Book Review</p>
          <div className="flex items-center space-x-2">
            <Button onClick={handleLogout} size={"sm"}>
              LogOut
            </Button>
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
