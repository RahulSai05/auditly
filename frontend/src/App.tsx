import { Route, Routes, useNavigate, useLocation, Navigate, Outlet, useFetcher } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, ReactNode } from "react";
// Import all your page components as before
import Home from "./pages/Home";
import HelpCenter from "./pages/HelpCenter";
import Options from "./pages/Options";
import GetAll from "./pages/manual/GetAll";
import Details from "./pages/manual/return /Details";
import Inspection from "./pages/manual/return /Inspection";
import UploadMedia from "./pages/manual/return /Uploadmedia";
import Compare from "./pages/manual/return /Compare";
import Review from "./pages/manual/return /Review";
import Done from "./pages/manual/return /Done";
import Scan from "./pages/auto/Scan";
import Onboard from "./pages/inspection/Onboard";
import InspectionData from "./pages/inspection/InspectionData";
import RequestAccess from "./pages/inspection/RequestAccess";
import Dashboard from "./pages/admin/Dashboard";
import DashboardTables from "./pages/admin/DashboardTables";
import ItemUpload from "./pages/admin/ItemUpload";
import ItemImageUpload from "./pages/admin/ItemImageUpload";
import ItemImages from "./pages/admin/ItemImages";
import MappingRules from "./pages/admin/MappingRules";
import AdminLayout from "./components/AdminLayout";
import ItemReturn from "./pages/admin/ItemReturn";
import CustomerSerials from "./pages/admin/CustomerSerials";
import ReturnDetails from "./components/ReturnDetails";
import AuditlyInspection from "./pages/admin/AuditlyInspection";
import UserMaintenance from "./pages/admin/UserMaintenance";
import CustomerSerialUpload from "./pages/admin/CustomerSerialUpload";
import EmailConfigurations from "./pages/admin/EmailConfigurations";
import Inbound from "./pages/admin/Inbound";
import Outbound from "./pages/admin/Outbound";
import Schedule from "./pages/agent/Schedule";
import AssignDeliveries from "./pages/manager/AssignDeliveries";
import AssignPickups from "./pages/manager/AssignPickups";
import UserPermissionRequests from "./pages/agent/UserPermissionRequests";
import ScheduledDeliveries from "./pages/agent/ScheduledDeliveries";
import ScheduledPickups from "./pages/agent/ScheduledPickups";
import ApiConfigurations from "./pages/admin/ApiConfigurations";
import LoadingScreen from "./components/LoadingScreen";
import ApiEndpoint from "./pages/admin/ApiEndpoint";
import Login from "./components/auth/Login";
import Unauthorized from "./components/auth/Unauthorized";
import Register from "./components/auth/Register";
import AuthSuccess from "./components/auth/AuthSuccess";
import ForgotPassword from "./components/auth/Forgot";
import ResetPassword from "./components/auth/Reset";
import EditProfile from "./components/auth/EditProfile";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import { RootState } from "./store/store";
import { setAgentId, setManagerId } from "./store/slices/itemSlice";


// Type definitions
interface UserData {
  "User Type": string[];
  [key: string]: any;
}

interface ProtectedRouteProps {
  children: ReactNode;
}


// Protected route components
const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [userData] = useState<UserData | null>(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  if (!userData) return null;

  const isAdmin = userData && Array.isArray(userData["User Type"]) &&
    userData["User Type"].includes("admin");

  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

const ReportsRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [userData] = useState<UserData | null>(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  if (!userData) return null;

  const isReportUser = userData && Array.isArray(userData["User Type"]) &&
    userData["User Type"].includes("reports_user");

  return (isReportUser) ? <>{children}</> : <Navigate to="/login" />;
};

const InspectionRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [userData] = useState<UserData | null>(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  if (!userData) return null;

  const isInspectionUser = userData && Array.isArray(userData["User Type"]) &&
    userData["User Type"].includes("inpection_user");

  return (isInspectionUser) ? <>{children}</> : <Navigate to="/unauthorized" />;
};

// Auth verification component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token") !== null;
  const location = useLocation();

  const isauthroute = authRoutes.includes(location.pathname);

  if (!isLoggedIn && !isauthroute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};


const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];


export default function App(): JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const itemData = useSelector((state: RootState) => state.ids);
  const managerId = useSelector((state: RootState) => state.ids.managerId);

  const [userData, setUserData] = useState<UserData | null>(() => {
    const userDataString = localStorage.getItem("token");
    return userDataString ? JSON.parse(userDataString) : null;
  });

  const [checkingUserValidity, setCheckingUserValidity] = useState(true);

  // ✅ Prevent rendering anything while validating on auth routes
  if (authRoutes.includes(location.pathname) && checkingUserValidity) {
    return null;
  }

  // ✅ Show loading only on protected routes while checking validity
  if (!location.pathname || (checkingUserValidity && !authRoutes.includes(location.pathname))) {
    return <LoadingScreen />;
  }

  // ✅ Control Navbar/Footer visibility
  const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);

  useEffect(() => {
    const localUser = localStorage.getItem("token");
    setUserData(localUser ? JSON.parse(localUser) : null);
  }, [location.pathname]);

  useEffect(() => {
    const checkUserValidity = async () => {
      try {
        if (authRoutes.includes(location.pathname)) {
          setCheckingUserValidity(false);
          return;
        }

        const res = await fetch("https://auditlyai.com/api/users");
        const data = await res.json();

        if (data.data && userData) {
          const userExistsData = data.data.find(
            (user: any) => user?.user_name === userData["User Name"]
          );

          if (userExistsData) {
            if (userExistsData.agent_id) {
              localStorage.setItem("agentId", userExistsData.agent_id.toString());
              dispatch(setAgentId(userExistsData.agent_id));
            } else {
              localStorage.removeItem("agentId");
              dispatch(setAgentId(null));
            }

            if (userExistsData.manager_id) {
              localStorage.setItem("managerId", userExistsData.manager_id.toString());
              dispatch(setManagerId(userExistsData.manager_id));
            } else {
              localStorage.removeItem("managerId");
              dispatch(setManagerId(null));
            }

            const requiredUserTypes = userData["User Type"];
            let isAuthorized = requiredUserTypes.every((type) => {
              if (type === "admin") return userExistsData.is_admin;
              if (type === "reports_user") return userExistsData.is_reports_user;
              if (type === "inpection_user") return userExistsData.is_inpection_user;
              return false;
            });

            if (!isAuthorized) {
              localStorage.removeItem("token");
              localStorage.removeItem("usertype");
              navigate("/login", { replace: true });
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("usertype");
            navigate("/login");
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("usertype");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error checking user validity:", error);
      } finally {
        setCheckingUserValidity(false);
      }
    };

    const timer = setTimeout(checkUserValidity, 200);
    return () => clearTimeout(timer);
  }, [location.pathname, userData]);

  useEffect(() => {
    console.log(itemData);
  }, [itemData]);

// export default function App(): JSX.Element {
//   const itemData = useSelector((state: RootState) => state.ids);
//   const managerId = useSelector((state: RootState) => state.ids.managerId); 
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   if (!location.pathname) {
//     return null;
//   }

//   const [userData, setUserData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   const [checkingUserValidity, setCheckingUserValidity] = useState(true);

//   if (authRoutes.includes(location.pathname) && checkingUserValidity) {
//     return null; // 🛑 Prevent flash of Navbar/Footer on auth routes
//   }

//   useEffect(() => {
//     const localUser = localStorage.getItem("token");
//     setUserData(localUser ? JSON.parse(localUser) : null);
//   }, [location.pathname]); // Sync state with localStorage

//   useEffect(() => {
//     console.log("Updated userData:", userData);
//   }, [userData]); // Log changes

//   useEffect(() => {
//     const checkUserValidity = async () => {
//       try {

//         if (authRoutes.includes(location.pathname)) {
//           setCheckingUserValidity(false); // Skip validation for auth pages
//           return;
//         }
        
//         const res = await fetch("https://auditlyai.com/api/users");
//         const data = await res.json();

//         if (data.data && userData) {
//           const userExists = data.data.some((user: any) => user?.user_name === userData["User Name"]);

//           let userExistsData = userExists
//             ? data.data.filter((user: any) => user?.user_name === userData["User Name"])[0]
//             : null;
            
//           console.log("API returned userExistsData:", userExistsData);
//           if (userExists && userExistsData) {

//             if (userExistsData.agent_id) {
//               localStorage.setItem("agentId", userExistsData.agent_id.toString());
//               dispatch(setAgentId(userExistsData.agent_id));
//               console.log("Agent ID set:", userExistsData.agent_id);
//             } else {
//               localStorage.removeItem("agentId");
//               dispatch(setAgentId(null));
//             }

//             if (userExistsData.manager_id) {
//               localStorage.setItem("managerId", userExistsData.manager_id.toString());
//               dispatch(setManagerId(userExistsData.manager_id));
//               console.log("Manager ID set:", userExistsData.manager_id);
//             } else {
//               localStorage.removeItem("managerId");
//               dispatch(setManagerId(null));
//             }
            

//             const requiredUserTypes = userData["User Type"];
//             let isAuthorized = true;

//             // Check all required permissions are present
//             for (let i = 0; i < requiredUserTypes.length; i++) {
//               const userType = requiredUserTypes[i];

//               if (userType === "reports_user" && !userExistsData.is_reports_user) {
//                 console.log("Missing required permission: reports_user");
//                 isAuthorized = false;
//                 break;
//               } else if (userType === "admin" && !userExistsData.is_admin) {
//                 console.log("Missing required permission: admin");
//                 isAuthorized = false;
//                 break;
//               } else if (userType === "inpection_user" && !userExistsData.is_inpection_user) {
//                 console.log("Missing required permission: inpection_user");
//                 isAuthorized = false;
//                 break;
//               }
//             }

//             // Check no additional permissions are present
//             if (isAuthorized) {
//               // Check if user has reports_user permission
//               if (userExistsData.is_reports_user && !requiredUserTypes.includes("reports_user")) {
//                 console.log("User has unauthorized permission: reports_user");
//                 isAuthorized = false;
//               }

//               // Check if user has admin permission
//               if (userExistsData.is_admin && !requiredUserTypes.includes("admin")) {
//                 console.log("User has unauthorized permission: admin");
//                 isAuthorized = false;
//               }

//               // Check if user has inpection_user permission
//               if (userExistsData.is_inpection_user && !requiredUserTypes.includes("inpection_user")) {
//                 console.log("User has unauthorized permission: inpection_user");
//                 isAuthorized = false;
//               }
//             }

//             console.log("User exists data:", userExistsData);
//             console.log("User types required:", userData["User Type"]);
//             console.log("User authorized with exact permissions:", isAuthorized);

//             if (!isAuthorized) {
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("usertype");
//                 navigate("/login", { replace: true });
//             }
//           } else if (!userExists) {
//             console.log("User does not exist");
//             localStorage.removeItem("token");
//             localStorage.removeItem("usertype");
//             navigate("/login");
//           }
//         } else {
//            console.log("Invalid user state");
//            localStorage.removeItem("token");
//            localStorage.removeItem("usertype");
//            navigate("/login", { replace: true });
//         }
//       } catch (error) {
//         console.error("Error checking user validity:", error);
//       } finally {
//       setCheckingUserValidity(false); // Always stop loading after check
//         }
//     };

//     const timer = setTimeout(() => {
//       console.log("Checking user validity...");
//       checkUserValidity();
//     }, 200);

//     return () => clearTimeout(timer); // Cleanup timeout
//   }, [location.pathname, userData]); // Ensure fresh userData






//   // List of routes where Navbar and Footer should be hidden
//   // const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);
//   // const shouldHideNavbarAndFooter = checkingUserValidity || authRoutes.includes(location.pathname);
//   const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);




//   useEffect(() => {
//     console.log(itemData);
//   }, [itemData]);

//   if (checkingUserValidity || location.pathname === "") {
//     return <LoadingScreen />;
//   }
  


  return (
    <>
      {/* Conditionally render Navbar */}
      {!shouldHideNavbarAndFooter && <Navbar />}

      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/auth/success" element={<AuthSuccess />} /> 

        {/* Protected Routes with AdminLayout - Authentication Required */}
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* Admin Only Routes */}
          <Route path="/admin/settings/connectors/inbound" element={
            <AdminRoute>
              <Inbound />
            </AdminRoute>
          } />
          <Route path="/admin/agent/permission-requests" element={
            <UserPermissionRequests>
              <ScheduledDeliveries />
            </UserPermissionRequests>
          } />
          <Route path="/admin/settings/connectors/outbound" element={
            <AdminRoute>
              <Outbound />
            </AdminRoute>
          } />
          <Route path="/admin/settings/mapping-rules" element={
            <AdminRoute>
              <MappingRules />
            </AdminRoute>
          } />
          <Route path="/admin/settings/api-configurations" element={
            <AdminRoute>
              <ApiConfigurations />
            </AdminRoute>
          } />
          <Route path="/admin/settings/api-endpoint" element={
            <AdminRoute>
              <ApiEndpoint />
            </AdminRoute>
          } />
          <Route path="/admin/settings/email-configurations" element={
            <AdminRoute>
              <EmailConfigurations />
            </AdminRoute>
          } />
          <Route path="/admin/settings/users-maintenance" element={
            <AdminRoute>
              <UserMaintenance />
            </AdminRoute>
          } />

          {/* Reports User Routes (Reports users and Admins) */}
          <Route path="/admin/reports/items" element={
            <ReportsRoute>
              <DashboardTables />
            </ReportsRoute>
          } />
          <Route path="/admin/reports/customer-serials" element={
            <ReportsRoute>
              <CustomerSerials />
            </ReportsRoute>
          } />
          <Route path="/admin/reports/returns" element={
            <ReportsRoute>
              <ReturnDetails />
            </ReportsRoute>
          } />
          //-here
          <Route path="/admin/reports/item-images" element={
            <ReportsRoute>
              <ItemImages />
            </ReportsRoute>
          } />
          <Route path="/admin/reports/audity-inspections" element={
            <ReportsRoute>
              <AuditlyInspection />
            </ReportsRoute>
          } />

          {/* Inspection User Routes (Inspection users and Admins) */}
          <Route path="/admin/dashboard" element={
            <InspectionRoute>
              <Dashboard />
            </InspectionRoute>
          } />
          <Route path="/admin/settings/Item-master-upload" element={
            <InspectionRoute>
              <ItemUpload />
            </InspectionRoute>
          } />
          <Route path="/admin/settings/customer-serial-Upload" element={
            <InspectionRoute>
              <CustomerSerialUpload />
            </InspectionRoute>
          } />
          <Route path="/manager/assign-deliveries" element={
            <InspectionRoute>
              <AssignDeliveries />
            </InspectionRoute>
          } />
          <Route path="/manager/assign-pickups" element={
            <InspectionRoute>
              <AssignPickups />
            </InspectionRoute>
          } />
          <Route path="/admin/agent/schedule" element={
            <InspectionRoute>
              <Schedule />
            </InspectionRoute>
          } />
          <Route path="/admin/agent/scheduled-deliveries" element={
            <InspectionRoute>
              <ScheduledDeliveries />
            </InspectionRoute>
          } />
          <Route path="/admin/agent/scheduled-pickups" element={
            <InspectionRoute>
              <ScheduledPickups />
            </InspectionRoute>
          } />
          <Route path="/admin/settings/Item-Image-Upload" element={
            <InspectionRoute>
              <ItemImageUpload />
            </InspectionRoute>
          } />
          <Route path="/admin/settings/Return-Upload" element={
            <InspectionRoute>
              <ItemReturn />
            </InspectionRoute>
          } />


        </Route>

        {/* Other Protected Routes outside AdminLayout */}
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/onboard" element={
          <ProtectedRoute>
            <Onboard />
          </ProtectedRoute>
        } />
        <Route path="/inspection-data" element={
          <ProtectedRoute>
            <InspectionData />
          </ProtectedRoute>
        } />

        {/* Standard Inspection User Routes */}
        <Route path="/" element={
          <InspectionRoute>
            <Home />
          </InspectionRoute>
        } />
        <Route path="/options" element={
          <InspectionRoute>
            <Options />
          </InspectionRoute>
        } />
        <Route path="/help-center" element={
          <InspectionRoute>
            <HelpCenter />
          </InspectionRoute>
        } />
        <Route path="/option/manual" element={
          <InspectionRoute>
            <GetAll />
          </InspectionRoute>
        } />
        <Route path="/return/details" element={
          <InspectionRoute>
            <Details />
          </InspectionRoute>
        } />
        <Route path="/return/inspection" element={
          <InspectionRoute>
            <Inspection />
          </InspectionRoute>
        } />
        <Route path="/return/upload-media" element={
          <InspectionRoute>
            <UploadMedia />
          </InspectionRoute>
        } />
        <Route path="/return/compare" element={
          <InspectionRoute>
            <Compare />
          </InspectionRoute>
        } />
        <Route path="/return/review" element={
          <InspectionRoute>
            <Review />
          </InspectionRoute>
        } />
        <Route path="/return/done" element={
          <InspectionRoute>
            <Done />
          </InspectionRoute>
        } />
        <Route path="/request-access" element={
          <InspectionRoute>
            <RequestAccess />
          </InspectionRoute>
        } />
        <Route path="/auto/scan" element={
          <InspectionRoute>
            <Scan />
          </InspectionRoute>
        } />
        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );
}


// import { Route, Routes, useNavigate, useLocation, Navigate, Outlet, useFetcher } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState, ReactNode } from "react";
// // Import all your page components as before
// import Home from "./pages/Home";
// import HelpCenter from "./pages/HelpCenter";
// import Options from "./pages/Options";
// import GetAll from "./pages/manual/GetAll";
// import Details from "./pages/manual/return /Details";
// import Inspection from "./pages/manual/return /Inspection";
// import UploadMedia from "./pages/manual/return /Uploadmedia";
// import Compare from "./pages/manual/return /Compare";
// import Review from "./pages/manual/return /Review";
// import Done from "./pages/manual/return /Done";
// import Scan from "./pages/auto/Scan";
// import Onboard from "./pages/inspection/Onboard";
// import InspectionData from "./pages/inspection/InspectionData";
// import RequestAccess from "./pages/inspection/RequestAccess";
// import Dashboard from "./pages/admin/Dashboard";
// import DashboardTables from "./pages/admin/DashboardTables";
// import ItemUpload from "./pages/admin/ItemUpload";
// import ItemImageUpload from "./pages/admin/ItemImageUpload";
// import ItemImages from "./pages/admin/ItemImages";
// import MappingRules from "./pages/admin/MappingRules";
// import AdminLayout from "./components/AdminLayout";
// import ItemReturn from "./pages/admin/ItemReturn";
// import CustomerSerials from "./pages/admin/CustomerSerials";
// import ReturnDetails from "./components/ReturnDetails";
// import AuditlyInspection from "./pages/admin/AuditlyInspection";
// import UserMaintenance from "./pages/admin/UserMaintenance";
// import CustomerSerialUpload from "./pages/admin/CustomerSerialUpload";
// import EmailConfigurations from "./pages/admin/EmailConfigurations";
// import Inbound from "./pages/admin/Inbound";
// import Outbound from "./pages/admin/Outbound";
// import Schedule from "./pages/agent/Schedule";
// import AssignDeliveries from "./pages/manager/AssignDeliveries";
// import AssignPickups from "./pages/manager/AssignPickups";
// import UserPermissionRequests from "./pages/agent/UserPermissionRequests";
// import ScheduledDeliveries from "./pages/agent/ScheduledDeliveries";
// import ScheduledPickups from "./pages/agent/ScheduledPickups";
// import ApiConfigurations from "./pages/admin/ApiConfigurations";
// import LoadingScreen from "./components/LoadingScreen";
// import ApiEndpoint from "./pages/admin/ApiEndpoint";
// import Login from "./components/auth/Login";
// import Unauthorized from "./components/auth/Unauthorized";
// import Register from "./components/auth/Register";
// import AuthSuccess from "./components/auth/AuthSuccess";
// import ForgotPassword from "./components/auth/Forgot";
// import ResetPassword from "./components/auth/Reset";
// import EditProfile from "./components/auth/EditProfile";
// import { Navbar } from "./components/Navbar";
// import Footer from "./components/Footer";
// import { RootState } from "./store/store";
// import { setAgentId, setManagerId } from "./store/slices/itemSlice";


// // Type definitions
// interface UserData {
//   "User Type": string[];
//   [key: string]: any;
// }

// interface ProtectedRouteProps {
//   children: ReactNode;
// }


// // Protected route components
// const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [userData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   if (!userData) return null;

//   const isAdmin = userData && Array.isArray(userData["User Type"]) &&
//     userData["User Type"].includes("admin");

//   return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
// };

// const ReportsRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [userData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   if (!userData) return null;

//   const isReportUser = userData && Array.isArray(userData["User Type"]) &&
//     userData["User Type"].includes("reports_user");

//   return (isReportUser) ? <>{children}</> : <Navigate to="/login" />;
// };

// const InspectionRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [userData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   if (!userData) return null;

//   const isInspectionUser = userData && Array.isArray(userData["User Type"]) &&
//     userData["User Type"].includes("inpection_user");

//   return (isInspectionUser) ? <>{children}</> : <Navigate to="/unauthorized" />;
// };

// // Auth verification component
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("token") !== null;
//   const location = useLocation();

//   const isauthroute = authRoutes.includes(location.pathname);

//   if (!isLoggedIn && !isauthroute) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];

// export default function App(): JSX.Element {
//   const itemData = useSelector((state: RootState) => state.ids);
//   const managerId = useSelector((state: RootState) => state.ids.managerId); 
//   const location = useLocation();
//   const dispatch = useDispatch();


//   const navigate = useNavigate();


//   const [userData, setUserData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   const [checkingUserValidity, setCheckingUserValidity] = useState(true);


//   useEffect(() => {
//     const localUser = localStorage.getItem("token");
//     setUserData(localUser ? JSON.parse(localUser) : null);
//   }, [location.pathname]); // Sync state with localStorage

//   useEffect(() => {
//     console.log("Updated userData:", userData);
//   }, [userData]); // Log changes

//   useEffect(() => {
//     const checkUserValidity = async () => {
//       try {

//         if (authRoutes.includes(location.pathname)) {
//           setCheckingUserValidity(false); // Skip validation for auth pages
//           return;
//         }
        
//         const res = await fetch("https://auditlyai.com/api/users");
//         const data = await res.json();

//         if (data.data && userData) {
//           const userExists = data.data.some((user: any) => user?.user_name === userData["User Name"]);

//           let userExistsData = userExists
//             ? data.data.filter((user: any) => user?.user_name === userData["User Name"])[0]
//             : null;
            
//           console.log("API returned userExistsData:", userExistsData);
//           if (userExists && userExistsData) {

//             if (userExistsData.agent_id) {
//               localStorage.setItem("agentId", userExistsData.agent_id.toString());
//               dispatch(setAgentId(userExistsData.agent_id));
//               console.log("Agent ID set:", userExistsData.agent_id);
//             } else {
//               localStorage.removeItem("agentId");
//               dispatch(setAgentId(null));
//             }

//             if (userExistsData.manager_id) {
//               localStorage.setItem("managerId", userExistsData.manager_id.toString());
//               dispatch(setManagerId(userExistsData.manager_id));
//               console.log("Manager ID set:", userExistsData.manager_id);
//             } else {
//               localStorage.removeItem("managerId");
//               dispatch(setManagerId(null));
//             }
            

//             const requiredUserTypes = userData["User Type"];
//             let isAuthorized = true;

//             // Check all required permissions are present
//             for (let i = 0; i < requiredUserTypes.length; i++) {
//               const userType = requiredUserTypes[i];

//               if (userType === "reports_user" && !userExistsData.is_reports_user) {
//                 console.log("Missing required permission: reports_user");
//                 isAuthorized = false;
//                 break;
//               } else if (userType === "admin" && !userExistsData.is_admin) {
//                 console.log("Missing required permission: admin");
//                 isAuthorized = false;
//                 break;
//               } else if (userType === "inpection_user" && !userExistsData.is_inpection_user) {
//                 console.log("Missing required permission: inpection_user");
//                 isAuthorized = false;
//                 break;
//               }
//             }

//             // Check no additional permissions are present
//             if (isAuthorized) {
//               // Check if user has reports_user permission
//               if (userExistsData.is_reports_user && !requiredUserTypes.includes("reports_user")) {
//                 console.log("User has unauthorized permission: reports_user");
//                 isAuthorized = false;
//               }

//               // Check if user has admin permission
//               if (userExistsData.is_admin && !requiredUserTypes.includes("admin")) {
//                 console.log("User has unauthorized permission: admin");
//                 isAuthorized = false;
//               }

//               // Check if user has inpection_user permission
//               if (userExistsData.is_inpection_user && !requiredUserTypes.includes("inpection_user")) {
//                 console.log("User has unauthorized permission: inpection_user");
//                 isAuthorized = false;
//               }
//             }

//             console.log("User exists data:", userExistsData);
//             console.log("User types required:", userData["User Type"]);
//             console.log("User authorized with exact permissions:", isAuthorized);

//             if (!isAuthorized) {
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("usertype");
//                 navigate("/login", { replace: true });
//             }
//           } else if (!userExists) {
//             console.log("User does not exist");
//             localStorage.removeItem("token");
//             localStorage.removeItem("usertype");
//             navigate("/login");
//           }
//         } else {
//            console.log("Invalid user state");
//            localStorage.removeItem("token");
//            localStorage.removeItem("usertype");
//            navigate("/login", { replace: true });
//         }
//       } catch (error) {
//         console.error("Error checking user validity:", error);
//       } finally {
//       setCheckingUserValidity(false); // Always stop loading after check
//         }
//     };

//     const timer = setTimeout(() => {
//       console.log("Checking user validity...");
//       checkUserValidity();
//     }, 200);

//     return () => clearTimeout(timer); // Cleanup timeout
//   }, [location.pathname, userData]); // Ensure fresh userData






//   // List of routes where Navbar and Footer should be hidden
//   const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
//   // const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);
//   // const shouldHideNavbarAndFooter = checkingUserValidity || authRoutes.includes(location.pathname);
//   const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);




//   useEffect(() => {
//     console.log(itemData);
//   }, [itemData]);

//   if (checkingUserValidity && !authRoutes.includes(location.pathname)) {
//     return <LoadingScreen />;
//   }
  


//   return (
//     <>
//       {/* Conditionally render Navbar */}
//       {!shouldHideNavbarAndFooter && <Navbar />}

//       <Routes>
//         {/* Public Routes - No Authentication Required */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/unauthorized" element={<Unauthorized />} />
//         <Route path="/auth/success" element={<AuthSuccess />} /> 

//         {/* Protected Routes with AdminLayout - Authentication Required */}
//         <Route element={
//           <ProtectedRoute>
//             <AdminLayout />
//           </ProtectedRoute>
//         }>
//           {/* Admin Only Routes */}
//           <Route path="/admin/settings/connectors/inbound" element={
//             <AdminRoute>
//               <Inbound />
//             </AdminRoute>
//           } />
//           <Route path="/admin/agent/permission-requests" element={
//             <UserPermissionRequests>
//               <ScheduledDeliveries />
//             </UserPermissionRequests>
//           } />
//           <Route path="/admin/settings/connectors/outbound" element={
//             <AdminRoute>
//               <Outbound />
//             </AdminRoute>
//           } />
//           <Route path="/admin/settings/mapping-rules" element={
//             <AdminRoute>
//               <MappingRules />
//             </AdminRoute>
//           } />
//           <Route path="/admin/settings/api-configurations" element={
//             <AdminRoute>
//               <ApiConfigurations />
//             </AdminRoute>
//           } />
//           <Route path="/admin/settings/api-endpoint" element={
//             <AdminRoute>
//               <ApiEndpoint />
//             </AdminRoute>
//           } />
//           <Route path="/admin/settings/email-configurations" element={
//             <AdminRoute>
//               <EmailConfigurations />
//             </AdminRoute>
//           } />
//           <Route path="/admin/settings/users-maintenance" element={
//             <AdminRoute>
//               <UserMaintenance />
//             </AdminRoute>
//           } />

//           {/* Reports User Routes (Reports users and Admins) */}
//           <Route path="/admin/reports/items" element={
//             <ReportsRoute>
//               <DashboardTables />
//             </ReportsRoute>
//           } />
//           <Route path="/admin/reports/customer-serials" element={
//             <ReportsRoute>
//               <CustomerSerials />
//             </ReportsRoute>
//           } />
//           <Route path="/admin/reports/returns" element={
//             <ReportsRoute>
//               <ReturnDetails />
//             </ReportsRoute>
//           } />
//           //-here
//           <Route path="/admin/reports/item-images" element={
//             <ReportsRoute>
//               <ItemImages />
//             </ReportsRoute>
//           } />
//           <Route path="/admin/reports/audity-inspections" element={
//             <ReportsRoute>
//               <AuditlyInspection />
//             </ReportsRoute>
//           } />

//           {/* Inspection User Routes (Inspection users and Admins) */}
//           <Route path="/admin/dashboard" element={
//             <InspectionRoute>
//               <Dashboard />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/settings/Item-master-upload" element={
//             <InspectionRoute>
//               <ItemUpload />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/settings/customer-serial-Upload" element={
//             <InspectionRoute>
//               <CustomerSerialUpload />
//             </InspectionRoute>
//           } />
//           <Route path="/manager/assign-deliveries" element={
//             <InspectionRoute>
//               <AssignDeliveries />
//             </InspectionRoute>
//           } />
//           <Route path="/manager/assign-pickups" element={
//             <InspectionRoute>
//               <AssignPickups />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/agent/schedule" element={
//             <InspectionRoute>
//               <Schedule />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/agent/scheduled-deliveries" element={
//             <InspectionRoute>
//               <ScheduledDeliveries />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/agent/scheduled-pickups" element={
//             <InspectionRoute>
//               <ScheduledPickups />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/settings/Item-Image-Upload" element={
//             <InspectionRoute>
//               <ItemImageUpload />
//             </InspectionRoute>
//           } />
//           <Route path="/admin/settings/Return-Upload" element={
//             <InspectionRoute>
//               <ItemReturn />
//             </InspectionRoute>
//           } />


//         </Route>

//         {/* Other Protected Routes outside AdminLayout */}
//         <Route path="/edit-profile" element={
//           <ProtectedRoute>
//             <EditProfile />
//           </ProtectedRoute>
//         } />
//         <Route path="/onboard" element={
//           <ProtectedRoute>
//             <Onboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/inspection-data" element={
//           <ProtectedRoute>
//             <InspectionData />
//           </ProtectedRoute>
//         } />

//         {/* Standard Inspection User Routes */}
//         <Route path="/" element={
//           <InspectionRoute>
//             <Home />
//           </InspectionRoute>
//         } />
//         <Route path="/options" element={
//           <InspectionRoute>
//             <Options />
//           </InspectionRoute>
//         } />
//         <Route path="/help-center" element={
//           <InspectionRoute>
//             <HelpCenter />
//           </InspectionRoute>
//         } />
//         <Route path="/option/manual" element={
//           <InspectionRoute>
//             <GetAll />
//           </InspectionRoute>
//         } />
//         <Route path="/return/details" element={
//           <InspectionRoute>
//             <Details />
//           </InspectionRoute>
//         } />
//         <Route path="/return/inspection" element={
//           <InspectionRoute>
//             <Inspection />
//           </InspectionRoute>
//         } />
//         <Route path="/return/upload-media" element={
//           <InspectionRoute>
//             <UploadMedia />
//           </InspectionRoute>
//         } />
//         <Route path="/return/compare" element={
//           <InspectionRoute>
//             <Compare />
//           </InspectionRoute>
//         } />
//         <Route path="/return/review" element={
//           <InspectionRoute>
//             <Review />
//           </InspectionRoute>
//         } />
//         <Route path="/return/done" element={
//           <InspectionRoute>
//             <Done />
//           </InspectionRoute>
//         } />
//         <Route path="/request-access" element={
//           <InspectionRoute>
//             <RequestAccess />
//           </InspectionRoute>
//         } />
//         <Route path="/auto/scan" element={
//           <InspectionRoute>
//             <Scan />
//           </InspectionRoute>
//         } />
//         {/* Catch-all redirect to home */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       {/* Conditionally render Footer */}
//       {!shouldHideNavbarAndFooter && <Footer />}
//     </>
//   );
// }