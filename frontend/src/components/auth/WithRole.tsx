import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the HOC
const withRole = (Component: React.ComponentType, allowedRoles: string[]) => {
  // Return a new component
  return (props: any) => {
    const navigate = useNavigate();

    // Get the user_type from localStorage
    const user_type = localStorage.getItem("user_type");

    // Check if the user is authorized
    useEffect(() => {
      if (!user_type || !allowedRoles.includes(user_type)) {
        // Redirect to unauthorized page or login page
        navigate("/unauthorized"); // You can change this to "/login" if needed
      }
    }, [user_type, navigate]);

    // If the user is not authorized, don't render the component
    if (!user_type || !allowedRoles.includes(user_type)) {
      return null; // You can also return a loading spinner or a message
    }

    // If the user is authorized, render the component
    return <Component {...props} />;
  };
};

export default withRole;
