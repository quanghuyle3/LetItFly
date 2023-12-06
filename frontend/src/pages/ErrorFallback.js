import { Link } from "react-router-dom";

const ErrorFallback = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Oops! Something went wrong.</h2>
      <p>We're sorry, but an unexpected error occurred.</p>
      <Link to="/">
        <button>Go back to login</button>
      </Link>
    </div>
  );
};

export default ErrorFallback;
