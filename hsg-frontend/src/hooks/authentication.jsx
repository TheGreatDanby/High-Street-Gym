import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, verifyToken } from "../api/users";

export const AuthenticationContext = createContext(null);

export function AuthenticationProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  const [authState, setAuthState] = useState({
    authenticatedUser: null,
    jwtToken: localStorage.getItem("jwtToken"),
  });
  const token = authState.jwtToken || localStorage.getItem("jwtToken");
  console.log("Retrieved token:", token);

  useEffect(() => {
    if (authState.jwtToken) {
      console.log("AuthenticationProvider authState:", authState);

      verifyToken(authState.jwtToken)
        .then((data) => {
          console.log("🚀 ~ file: authentication.jsx:33 ~ .then ~ data:", data);
          if (data.user) {
            setAuthState((prevState) => ({
              ...prevState,
              authenticatedUser: data.user,
            }));
          }
          setIsLoading(false);
        })
        .catch((error) => {
          localStorage.removeItem("jwtToken");
          setAuthState((prevState) => ({ ...prevState, jwtToken: null }));
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [authState.jwtToken]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <AuthenticationContext.Provider
      value={{ authState, setAuthState, isLoading, setIsLoading }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  const contextValue = useContext(AuthenticationContext);

  if (!contextValue) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider"
    );
  }

  const { authState, setAuthState, isLoading } = contextValue;

  async function login(email, password) {
    setAuthState((prevState) => ({ ...prevState, authenticatedUser: null }));

    try {
      const result = await apiLogin(email, password);
      console.log("Login result in AuthenticationProvider:", result);

      if (result.status === 200) {
        console.log("Received user data from server:", result.user);
        console.log("Received JWT token from server:", result.token);
        localStorage.setItem("jwtToken", result.token);
        setAuthState((prevState) => ({ ...prevState, jwtToken: result.token }));
        console.log("Stored token:", result.token);

        if (result.user) {
          setAuthState((prevState) => ({
            ...prevState,
            jwtToken: result.token,
            authenticatedUser: result.user,
          }));
        }

        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    localStorage.removeItem("jwtToken");
    setAuthState((prevState) => ({
      ...prevState,
      authenticatedUser: null,
      jwtToken: null,
    }));
  }

  return {
    authenticatedUser: authState.authenticatedUser,
    jwtToken: authState.jwtToken || localStorage.getItem("jwtToken"),
    login,
    logout,
    isLoading,
  };
}
