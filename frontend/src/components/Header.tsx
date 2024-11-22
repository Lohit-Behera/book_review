import { Link, NavLink } from "react-router-dom";
import { fetchLogout } from "@/features/UserSlice";
import { ModeToggle } from "./mode-toggle";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "../assets/Logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User2 } from "lucide-react";

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const userData = userDetails?.data || {};

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
          <Link to="/">
            <img src={Logo} alt="logo" className="w-10 h-10" />
          </Link>
          <div className="flex items-center space-x-4">
            <NavLink to="/create">
              {({ isActive }) => (
                <p
                  className={`${
                    isActive
                      ? "text-foreground underline"
                      : "text-muted-foreground/80"
                  } hover:underline hover;text-muted-foreground font-semibold`}
                >
                  Create Book
                </p>
              )}
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {userData.name ? userData.name[0] : "A"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${userData._id}`)}
                  className="cursor-pointer"
                >
                  <User2 />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/update`)}
                  className="cursor-pointer"
                >
                  <Settings />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
