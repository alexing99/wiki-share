import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <li>
            <Link to="/profile">User</Link>
          </li>
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          <li>
            <Link className="post-creation-link" to="/post">
              Create Post
            </Link>
          </li>
          <li className="menu-icon">
            <svg width="30" height="40" viewBox="0 0 10 5">
              <circle cx="2" cy="2" r="1" fill="black" />{" "}
              <circle cx="5" cy="2" r="1" fill="black" />{" "}
              <circle cx="8" cy="2" r="1" fill="black" />{" "}
            </svg>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
