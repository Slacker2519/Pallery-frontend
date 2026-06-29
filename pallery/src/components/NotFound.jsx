import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="bg-dark w-screen min-h-screen text-light text-3xl
      flex flex-col justify-center items-center border border-white"
    >
      <h1>Not Found Page ✖️</h1>
      <Link to="/">
        <button>Go back Home</button>
      </Link>
    </div>
  );
};

export default NotFound;
