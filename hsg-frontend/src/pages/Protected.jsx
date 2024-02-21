import { Navigate, useOutletContext } from "react-router-dom";

const Protected = ({ children }) => {
  const [user, setUser] = useOutletContext();
  console.log(`user passed to Protected:`, user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
export default Protected;
