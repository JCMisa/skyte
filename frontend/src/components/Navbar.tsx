import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Loader2Icon,
  LogOutIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

const Navbar = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const signout = useAuthStore((s) => s.signout);
  const isSigningOut = useAuthStore((s) => s.isSigningOut);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquareIcon className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Skyte</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <UserIcon className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center hover:text-red-500/80 transition-colors ml-5"
                  onClick={signout}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <>
                      <Loader2Icon className="size-5 animate-spin" />
                      <span className="hidden sm:inline">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOutIcon className="size-5" />
                      <span className="hidden sm:inline">Logout</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
