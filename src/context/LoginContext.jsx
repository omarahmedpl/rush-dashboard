import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Create the context
export const LoginContext = createContext({ isLoggedIn: false });

// Create the provider component
export const LoginProvider = ({ children }) => {
  // State to track the session ID
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!Cookies.get("rush_session_id")
  );

  useEffect(() => {
    // Function to check the session cookie
    const checkSession = () => {
      const sessionId = Cookies.get("rush_session_id");
      setIsLoggedIn(!!sessionId); // Update state based on the presence of the session ID
    };

    // Set up an interval to periodically check the cookie (optional)
    const interval = setInterval(checkSession, 1000); // Check every 1 second

    // Add a listener for changes to cookies (if applicable)
    window.addEventListener("cookiechange", checkSession);

    // Clean up the listener and interval on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener("cookiechange", checkSession);
    };
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};
