import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  Outlet,
} from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext.jsx";
import CarWashDashboardView from "../pages/CarWashDashboardView.jsx";
import Login from "../pages/Login.jsx";
import DefaultLayout from "../Layouts/DefaultLayout.jsx";
import SocketApp from "../connections/SocketApp.jsx";

// ProtectedRoute component to handle auth checks
const ProtectedRoute = ({ redirectTo, children }) => {
  const { isLoggedIn } = useContext(LoginContext);

  // If not logged in, redirect to the specified path
  return isLoggedIn ? children : <Navigate to={redirectTo} />;
};

// PublicRoute component to handle login redirection
const PublicRoute = ({ redirectTo, children }) => {
  const { isLoggedIn } = useContext(LoginContext);

  // If logged in, redirect to the specified path
  return !isLoggedIn ? children : <Navigate to={redirectTo} />;
};

// Define your routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Protected route for the dashboard */}
      <Route path="/" element={<DefaultLayout />}>
        <Route
          index
          element={
            <ProtectedRoute redirectTo="/login">
              <CarWashDashboardView />
            </ProtectedRoute>
          }
        />
        <Route path="/socket" element={<SocketApp />} />
      </Route>

      {/* Public route for login */}
      <Route
        path="/login"
        element={
          <PublicRoute redirectTo="/">
            <Login />
          </PublicRoute>
        }
      />
    </>
  )
);

export default router;
