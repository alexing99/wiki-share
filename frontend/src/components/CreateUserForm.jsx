import { useState } from "react";
import Cookies from "universal-cookie";

function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate password requirements
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      alert(
        "Password must be at least 6 characters long and contain at least one uppercase letter and one special character or number"
      );
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        console.log("User created successfully!");
        setName("");
        setEmail("");
        setPassword("");
        autoLogin(email, password);
      } else {
        const error = await response.json();
        console.error("Error creating user:", error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const autoLogin = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
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
        window.location.href = "/auth";
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
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
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
      <label>Confirm Password:</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUserForm;
