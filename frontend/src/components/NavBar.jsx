import { Link } from "react-router-dom";

function Navbar() {
  // const handleCreateUserClick = () => {
  //     setShowCreateUserForm(true);
  //     setShowLoginForm(false);
  //   };

  //   const handleLoginClick = () => {
  //     setShowLoginForm(true);
  //     setShowCreateUserForm(false);
  //   };

  //   const handleLogOut = () => {
  //     const cookies = new Cookies();
  //     cookies.remove("token");

  //     setLoggedIn(false);
  //   };
  return (
    <nav>
      <ul>
        <li>
          <Link to="/profile">User</Link>
        </li>
        <li>
          <Link to="/feed">Feed</Link>
        </li>
        <li>
          <Link to="/post">Create Post</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
