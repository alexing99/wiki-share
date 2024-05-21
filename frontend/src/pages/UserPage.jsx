import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Cookies from "universal-cookie";
import "../../src/styles/userPage.css";
import Carousel from "../components/Carousel"; // Assume you have a Carousel component

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
  const [showAuth, setShowAuth] = useState(false);
  const [showInt, setShowInt] = useState(false);

  const [authoredPosts, setAuthoredPosts] = useState([]);
  const [postsOfInt, setPostsOfInt] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const token = cookies.get("token");

  const tokenArray = token.split(".");
  const payload = tokenArray[1];

  const decodedPayload = JSON.parse(atob(payload));

  const userId = decodedPayload.id;
  console.log(userId);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("user information retreived!");
        const data = await response.json();
        setEmail(data.email);
        setName(data.name);

        console.log(data);
        fetchAuthoredPosts(data.name);
        fetchPostsOfInt(data.interestedIn);
      } else {
        const error = await response.json();
        console.error("Error retreiving user information:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteUser = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
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
      const response = await fetch(`${apiUrl}/users/${userId}`, {
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
  const fetchPostsOfInt = async (interests) => {
    console.log("int", interests);

    try {
      const posts = [];
      for (const postId of interests) {
        const response = await fetch(`${apiUrl}/posts/${postId}`);
        if (response.ok) {
          const post = await response.json();
          posts.push(post);
        } else {
          console.error(`Error fetching post with ID ${postId}`);
        }
      }
      console.log("Posts:", posts);
      // Now you can do whatever you want with the fetched posts, like setting state
      setPostsOfInt(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchAuthoredPosts = async (name) => {
    console.log(name);
    try {
      const response = await fetch(`${apiUrl}/posts/${name}/author`);
      if (response.ok) {
        const data = await response.json();
        console.log("author", data);
        setAuthoredPosts(data);
      }
    } catch (error) {
      console.error("Error fetching root posts:", error);
    }
  };
  const showAuthored = () => {
    if (!showAuth) {
      setShowAuth(true);
      setShowInt(false);
    } else if (showAuth) {
      setShowAuth(false);
    }
  };
  const showInterested = () => {
    if (!showInt) {
      setShowInt(true);
      setShowAuth(false);
    } else if (showInt) {
      setShowInt(false);
    }
  };
  const handleLogOut = async () => {
    const cookies = new Cookies();
    cookies.remove("token");
    window.location.href = "/";
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="user-div">
        <table className="bioBar">
          <tbody>
            <tr>
              <th colSpan="2" className="userName">
                <div>
                  {editName ? (
                    <>
                      {" "}
                      <input
                        type="text"
                        placeholder={name}
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                      <button onClick={updateUser}>[save]</button>
                    </>
                  ) : (
                    <>
                      <span>{name}</span>{" "}
                      <button onClick={() => setEditName(!editName)}>
                        [edit]
                      </button>
                    </>
                  )}
                </div>
              </th>
            </tr>

            <tr>
              <th scope="row" className="email">
                Email
              </th>

              {editEmail ? (
                <>
                  <input
                    type="email"
                    placeholder={email}
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />{" "}
                  <button onClick={updateUser}>[save]</button>
                </>
              ) : (
                <>
                  <td>{email}</td>
                  <button onClick={() => setEditEmail(!editEmail)}>
                    [edit]
                  </button>
                </>
              )}
            </tr>
          </tbody>
        </table>
        <div className="buttons">
          <button onClick={handleLogOut}>[Log Out]</button>
          {!showChangePasswordForm ? (
            <button onClick={handleChangePassword}>[Change Password]</button>
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
              <button type="submit">[save]</button>
            </form>
          )}

          <button onClick={deleteUser}>[Delete Account]</button>
          <button onClick={showAuthored}>
            {showAuth ? "Hide Your Posts" : "Show Your Posts"}
          </button>
          <button onClick={showInterested}>
            {" "}
            {showInt ? "Hide Posts of Interest" : "Show Posts of Interest"}
          </button>

          <div className="userPosts"></div>
          <div className="userInterest"></div>
        </div>
        {/* Render authored posts if showAuthored is true */}
        {showAuth && (
          <div className="userPosts">
            {authoredPosts.map((rootPost) => (
              <Carousel key={rootPost._id} rootPost={rootPost} />
            ))}
          </div>
        )}

        {/* Render interested posts if showAuthored is false */}
        {showInt && (
          <div className="userInterests">
            {postsOfInt.map((rootPost) => (
              <Carousel key={rootPost._id} rootPost={rootPost} forUser={true} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
