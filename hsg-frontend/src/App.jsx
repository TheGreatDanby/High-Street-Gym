import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Users from "./pages/Users";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Timetable from "./pages/Timetable";
import Navbar from "./components/Navbar";
import ClassesCRUD from "./pages/ClassesCRUD";
import Logout from "./components/Logout";
import Footer from "./components/Footer";
import {
  AuthenticationProvider,
  useAuthentication,
} from "./hooks/authentication";
import Swal from "sweetalert2";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const useUnauthorizedAlert = (allowedRoles, authenticatedUser) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (allowedRoles.length && !allowedRoles.includes(authenticatedUser.role)) {
      Swal.fire({
        title: "Access Denied",
        text: "User role not authorized. Redirecting to the homepage...",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/");
      });
    }
  }, [allowedRoles, authenticatedUser, navigate]);
};

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "404 - Not Found",
      text: "You will be redirected to the homepage.",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
      willClose: () => {
        navigate("/");
      },
    });
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthenticationProvider>
        <div className="flex">
          <Navbar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="*" element={<NotFoundRedirect />} />

              <Route path="/" element={<Login />} />
              <Route
                path="/users"
                element={
                  <ElementWrapper allowedRoles={["Admin", "Trainer", "Member"]}>
                    <Users />
                  </ElementWrapper>
                }
              />
              <Route
                path="/timetable"
                element={
                  <ElementWrapper allowedRoles={["Admin", "Trainer", "Member"]}>
                    <Timetable />
                  </ElementWrapper>
                }
              />
              <Route
                path="/classes"
                element={
                  <ElementWrapper allowedRoles={["Admin", "Trainer"]}>
                    <ClassesCRUD />
                  </ElementWrapper>
                }
              />
              <Route
                path="/blog"
                element={
                  <ElementWrapper allowedRoles={["Admin", "Trainer", "Member"]}>
                    <Blog />
                  </ElementWrapper>
                }
              />
              <Route
                path="/logout"
                element={
                  <ElementWrapper>
                    <Logout />
                  </ElementWrapper>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthenticationProvider>
    </Router>
  );
};

const ElementWrapper = ({ children, allowedRoles = [] }) => {
  const { authenticatedUser, isLoading } = useAuthentication();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authenticatedUser) {
    console.log("User not authenticated. Redirecting to root.");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(authenticatedUser.role)) {
    useUnauthorizedAlert(allowedRoles, authenticatedUser);
    console.log("User role not authorized. Redirecting to root.");
    return;
  }

  return children;
};

export default App;
