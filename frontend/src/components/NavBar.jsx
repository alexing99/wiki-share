import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";
import { useUser } from "../UserContext";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const user = useUser();
  useEffect(() => {
    // Scroll to the newly created post when the component mounts
    console.log(user);
    if (user != null) {
      setIsUser(true);
    }
  }, [user]);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="menu-container">
        <ul
          id="menu"
          onClick={toggleMenu}
          className={`menu-list slide-horizontal ${isOpen ? "open" : ""}`}
        >
          {isUser ? (
            <li className="firstLi">
              <Link to="/profile">User</Link>
            </li>
          ) : (
            <li className="firstLi">
              <Link to="/auth">Login</Link>
            </li>
          )}
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          {isUser ? (
            <li>
              <Link to="/post">Create Post</Link>
            </li>
          ) : (
            <li>
              <Link to="/auth">Create Post</Link>
            </li>
          )}
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
