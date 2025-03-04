import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WithNonAdminRole = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (userType === "admin") {
      navigate("/unauthorized");
    }
  }, [userType, navigate]);

  if (userType === "admin") {
    return null; // Return null or a loading spinner while checking
  }

  return children;
};

export default WithNonAdminRole;
