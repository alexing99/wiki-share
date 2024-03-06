import { Link } from "react-router-dom";

function Navbar() {
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
