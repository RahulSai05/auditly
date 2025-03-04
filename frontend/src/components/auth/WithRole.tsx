import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WithRole = ({
  children,
  allowedRoles,
  fallbackPath = "/unauthorized",
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}) => {
  const navigate = useNavigate();
  const user_type = localStorage.getItem("user_type");

  useEffect(() => {
    if (!user_type || !allowedRoles.includes(user_type)) {
      navigate(fallbackPath);
    }
  }, [user_type, allowedRoles, navigate, fallbackPath]);

  if (!user_type || !allowedRoles.includes(user_type)) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default WithRole;
