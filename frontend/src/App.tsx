import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Layout from "./Layout";
import HomePage from "@/pages/HomePage";
import SignUpPage from "@/pages/SignUpPage";
import LoginPage from "@/pages/LoginPage";
import CreateBookPage from "@/pages/CreateBookPage";
import BookPage from "./pages/BookPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";

// TODO feature books
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        index
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:bookId"
        element={
          <ProtectedRoute>
            <BookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/update"
        element={
          <ProtectedRoute>
            <ProfileUpdatePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/create"
        element={
          <AdminRoute>
            <CreateBookPage />
          </AdminRoute>
        }
      />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors />
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
      ></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
