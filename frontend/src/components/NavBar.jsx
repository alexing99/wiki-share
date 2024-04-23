import { useState } from "react";
import { Link } from "react-router-dom";
// import "../styles/nav.css";

// eslint-disable-next-line react/prop-types
function Navbar({ onClick }) {
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
          <ul id="menu" className="menu-list">
            <li>
              <Link to="/profile" onClick={onClick}>
                User
              </Link>
            </li>
            <li>
              <Link to="/feed" onClick={onClick}>
                Feed
              </Link>
            </li>
            <li>
              <Link className="post-creation-link" onClick={onClick} to="/post">
                Create Post
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
