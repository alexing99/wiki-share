// return (
//   <div className="login-form">
//     <h1>please log in</h1>
//     <form action="/log-in" method="POST">
//       <label for="username">Username</label>
//       <input name="username" placeholder="username" type="text" />
//       <label for="password">Password</label>
//       <input name="password" type="password" />
//       <button>Log In</button>
//     </form>
//   </div>
// );

import { useState } from "react";

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
        console.log("login successful!");
        setEmail("");
        setPassword("");
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
