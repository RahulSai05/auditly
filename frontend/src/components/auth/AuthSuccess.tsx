import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || "Authentication successful!";
  const error = searchParams.get('error');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: error ? 'AUTH_ERROR' : 'AUTH_SUCCESS',
            message: error || message
          }, window.location.origin);
        }
        window.close();
      } catch (e) {
        console.error("Error closing window:", e);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        {error ? (
          <>
            <div className="text-red-500 text-5xl mb-4">✖</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
          </>
        ) : (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Success!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
          </>
        )}
        <p className="text-sm text-gray-500">
          This window will close automatically...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
