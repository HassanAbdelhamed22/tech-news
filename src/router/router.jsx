import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const MyNews = lazy(() => import("../pages/MyNews"));
const AddNews = lazy(() => import("../pages/AddNews"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const NewsDetails = lazy(() => import("../pages/NewsDetails"));
const Feed = lazy(() => import("../pages/Feed"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "news/:id",
        element: <NewsDetails />,
      },
      {
        path: "my-news",
        element: (
          <ProtectedRoute>
            <MyNews />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-news",
        element: (
          <ProtectedRoute>
            <AddNews />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
