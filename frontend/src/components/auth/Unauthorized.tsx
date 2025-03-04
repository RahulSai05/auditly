import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>

        {/* Message */}
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page. Please contact the
          administrator if you believe this is an error.
        </p>

        {/* Button to Go Back */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 mb-4"
        >
          Go Back
        </button>

        {/* Button to Go to Login */}
        <button
          onClick={() => navigate("/login")} // Redirect to the login page
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Go to Login
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-8">
        Need help?{" "}
        <a
          href="mailto:support@example.com"
          className="text-blue-600 hover:underline"
        >
          Contact Support
        </a>
      </p>
    </div>
  );
};

export default Unauthorized;
