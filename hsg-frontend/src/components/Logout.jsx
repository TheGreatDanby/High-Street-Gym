import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuthentication();

  useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return null;
}

export default Logout;
