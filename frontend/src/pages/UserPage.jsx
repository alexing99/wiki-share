import { useState } from "react";
import Navbar from "../components/NavBar";
import Cookies from "universal-cookie";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const cookies = new Cookies();

  const token = cookies.get("token");

  const tokenArray = token.split(".");
  const payload = tokenArray[1];

  const decodedPayload = JSON.parse(atob(payload));

  const userId = decodedPayload.id;
  console.log(userId);

  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:4578/users/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        // if successful, the token will be returned here
        console.log("user information retreived!");
        const data = await response.json();
        setEmail(data.email);
        setName(data.name);
        console.log(data);

        // Save the token to cookies
      } else {
        const error = await response.json();
        console.error("Error retreiving user information:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  getUserInfo();

  return (
    <>
      <Navbar></Navbar>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </>
  );
}

export default Profile;
