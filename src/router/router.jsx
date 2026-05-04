import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import MyNews from "../pages/MyNews";
import AddNews from "../pages/AddNews";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ErrorPage from "../pages/ErrorPage";
import NewsDetails from "../pages/NewsDetails";
import Feed from "../pages/Feed";

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
