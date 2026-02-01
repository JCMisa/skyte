import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const authUser = useAuthStore((s) => s.authUser);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);

  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex w-screen items-center justify-center h-screen">
        <LoaderIcon className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/signin"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signin"
          element={!authUser ? <SigninPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/signin"} />}
        />

        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
