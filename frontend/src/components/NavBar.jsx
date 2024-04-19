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
        <button className="menu-btn" onClick={toggleMenu}>
          Menu
        </button>
        {isOpen && (
          <ul className="menu-list">
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
        )}
      </div>
    </nav>
  );
}

export default Navbar;
