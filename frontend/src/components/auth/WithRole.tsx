import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WithRole = ({ allowedRoles, children }: { allowedRoles: string[], children: JSX.Element }) => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (!userType || !allowedRoles.includes(userType)) {
      navigate("/unauthorized");
    }
  }, [userType, allowedRoles, navigate]);

  if (!userType || !allowedRoles.includes(userType)) {
    return null;
  }

  return children;
};

export default WithRole;
