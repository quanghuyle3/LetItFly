import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">
        <button>Go back to login</button>
      </Link>
    </div>
  );
};

export default NotFound;
