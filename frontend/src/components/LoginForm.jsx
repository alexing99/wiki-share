import { useState } from "react";
import Cookies from "universal-cookie";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4578/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // if successful, the token will be returned here
        console.log("login successful!");
        const data = await response.json();
        const token = data.token;

        // Save the token to cookies
        const cookies = new Cookies();
        cookies.set("token", token, { path: "/" }); // Adjust path as needed
        setEmail("");
        setPassword("");
        window.location.href = "/feed";
      } else {
        const error = await response.json();
        console.error("Error logging in:", error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
