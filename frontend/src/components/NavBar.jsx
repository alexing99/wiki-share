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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
