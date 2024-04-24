import Cookies from "universal-cookie";
import { createContext, useState, useEffect, useContext } from "react";

// Create a context for user data
const UserContext = createContext();

// Custom hook to use user data
export const useUser = () => useContext(UserContext);

// UserProvider component to provide user data to the app
// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to fetch user data
  const getUserData = async () => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const tokenArray = token.split(".");
    const payload = tokenArray[1];

    const decodedPayload = JSON.parse(atob(payload));

    const userId = decodedPayload.id;
    try {
      const response = await fetch(`http://localhost:4578/users/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("user information retreived!");
        const data = await response.json();
        setUser(data);
      } else {
        const error = await response.json();
        console.error("Error retreiving user information:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect to fetch user data when the component mounts
  useEffect(() => {
    getUserData();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
