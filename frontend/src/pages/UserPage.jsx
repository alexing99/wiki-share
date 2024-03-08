import { useState } from "react";
import Navbar from "../components/NavBar";
import Cookies from "universal-cookie";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  //   const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
        console.log("user information retreived!");
        const data = await response.json();
        setEmail(data.email);
        setName(data.name);
        console.log(data);
      } else {
        const error = await response.json();
        console.error("Error retreiving user information:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  getUserInfo();
  const deleteUser = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:4578/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("User deleted");
        cookies.remove("token");
        window.location.href = "/";
      } else {
        const error = await response.json();
        console.error("Error deleting user account", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const updateUser = async () => {
    try {
      const response = await fetch(`http://localhost:4578/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          password: newPassword,
        }),
      });

      if (response.ok) {
        console.log("User updated");
        // Refresh user information after successful update

        window.location.href = "/profile";
      } else {
        const error = await response.json();
        console.error("Error updating user:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleChangePassword = async () => {
    setShowChangePasswordForm(true);
  };
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const validatePasswordChange = async () => {
    // see if current password is good
    // see if confirm password matches
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!validatePassword(newPassword)) {
      alert(
        "Password must be at least 6 characters long and contain at least one uppercase letter and one special character or number"
      );
      return;
    }
    updateUser();
  };

  return (
    <>
      <Navbar></Navbar>
      <p>
        Name:{" "}
        {editName ? (
          <>
            {" "}
            <input
              type="text"
              placeholder={name}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <button onClick={updateUser}>Save</button>
          </>
        ) : (
          <>
            <span>{name}</span>{" "}
            <button onClick={() => setEditName(!editName)}>Edit</button>
          </>
        )}
      </p>
      <p>
        Email:{" "}
        {editEmail ? (
          <>
            <input
              type="email"
              placeholder={email}
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />{" "}
            <button onClick={updateUser}>Save</button>
          </>
        ) : (
          <>
            <span>{email}</span>
            <button onClick={() => setEditEmail(!editEmail)}>Edit</button>
          </>
        )}
      </p>
      {!showChangePasswordForm ? (
        <button onClick={handleChangePassword}>Change Password</button>
      ) : (
        <form onSubmit={validatePasswordChange}>
          {/* <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          /> */}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <button type="submit">Save</button>
        </form>
      )}

      <button onClick={deleteUser}>Delete Account</button>
    </>
  );
}

export default Profile;
