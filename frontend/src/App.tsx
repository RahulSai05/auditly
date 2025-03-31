// import { Route, Routes, useNavigate, useLocation, Navigate, Outlet, useFetcher } from "react-router-dom";
// import { useSelector } from "react-redux";
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
// import CustomerSerialUpload from "./pages/admin/CustomerSerialUpload";
// import UserMaintenance from "./pages/admin/UserMaintenance";
// import EmailConfigurations from "./pages/admin/EmailConfigurations";
// import Inbound from "./pages/admin/Inbound";
// import Outbound from "./pages/admin/Outbound";
// import ApiConfigurations from "./pages/admin/ApiConfigurations";
// import Login from "./components/auth/Login";
// import Unauthorized from "./components/auth/Unauthorized";
// import Register from "./components/auth/Register";
// import ForgotPassword from "./components/auth/Forgot";
// import ResetPassword from "./components/auth/Reset";
// import EditProfile from "./components/auth/EditProfile";
// import { Navbar } from "./components/Navbar";
// import Footer from "./components/Footer";
// import { RootState } from "./store/store";

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

//   const isAdmin = userData && Array.isArray(userData["User Type"]) &&
//     userData["User Type"].includes("admin");

//   return isAdmin ? <>{children}</> : <Navigate to="/unauthorized" />;
// };

// const ReportsRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [userData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   const isReportUser = userData && Array.isArray(userData["User Type"]) &&
//     userData["User Type"].includes("reports_user");

//   return (isReportUser) ? <>{children}</> : <Navigate to="/unauthorized" />;
// };

// const InspectionRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [userData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

//   const isInspectionUser = userData && Array.isArray(userData["User Type"]) &&
//     userData["User Type"].includes("inpection_user");

//   return (isInspectionUser) ? <>{children}</> : <Navigate to="/unauthorized" />;
// };

// // Auth verification component
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("token") !== null;
//   const location = useLocation();

//   const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
//   const isauthroute = authRoutes.includes(location.pathname);

//   if (!isLoggedIn && !isauthroute) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// export default function App(): JSX.Element {
//   const itemData = useSelector((state: RootState) => state.ids);
//   const location = useLocation();


//   const navigate = useNavigate();


//   const [userData, setUserData] = useState<UserData | null>(() => {
//     const userDataString = localStorage.getItem("token");
//     return userDataString ? JSON.parse(userDataString) : null;
//   });

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
//         const res = await fetch("https://auditlyai.com/api/users");
//         const data = await res.json();

//         if (data.data && userData) {
//           const userExists = data.data.some((user: any) => user?.user_name === userData["User Name"]);

//           let userExistsData = userExists
//             ? data.data.filter((user: any) => user?.user_name === userData["User Name"])[0]
//             : null;

//           if (userExists && userExistsData) {
//             // Check if user has EXACTLY the permissions specified in User Type array (no more, no less)
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
//               localStorage.removeItem("token");
//               localStorage.removeItem("usertype");
//               const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
//               const isauthroute = authRoutes.includes(location.pathname);
//               if (isauthroute) {
//                 console.log("Asd")
//                 navigate("/login");
//               }
//             }
//           } else if (!userExists) {
//             console.log("User does not exist");
//             localStorage.removeItem("token");
//             localStorage.removeItem("usertype");
//             navigate("/login");
//           }
//         } else {
//           console.log("Invalid user state");
//           localStorage.removeItem("token");
//           localStorage.removeItem("usertype");
//           const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
//           const isauthroute = authRoutes.includes(location.pathname);
//           if (!isauthroute) {
//             console.log("here logged in")
//             navigate("/login");
//           }
//         }
//       } catch (error) {
//         console.error("Error checking user validity:", error);
//       }
//     };

//     const timer = setTimeout(() => {
//       console.log("Checking user validity...");
//       checkUserValidity();
//     }, 200);

//     return () => clearTimeout(timer); // Cleanup timeout
//   }, [location.pathname, userData]); // Ensure fresh userData






//   // List of routes where Navbar and Footer should be hidden
//   const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
//   const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);


//   useEffect(() => {
//     console.log(itemData);
//   }, [itemData]);

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


import { Route, Routes, useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
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
import CustomerSerialUpload from "./pages/admin/CustomerSerialUpload";
import UserMaintenance from "./pages/admin/UserMaintenance";
import EmailConfigurations from "./pages/admin/EmailConfigurations";
import Inbound from "./pages/admin/Inbound";
import Outbound from "./pages/admin/Outbound";
import ApiConfigurations from "./pages/admin/ApiConfigurations";
import Login from "./components/auth/Login";
import Unauthorized from "./components/auth/Unauthorized";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/Forgot";
import ResetPassword from "./components/auth/Reset";
import EditProfile from "./components/auth/EditProfile";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import { RootState } from "./store/store";

// Type definitions
interface UserData {
  "User Type": string[];
  [key: string]: any;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

// Static loading HTML to prevent flash of UI
const staticLoadingStyle = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

// Protected route components
const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const userData = JSON.parse(localStorage.getItem("token") || "null");
  const isAdmin = userData && Array.isArray(userData["User Type"]) &&
    userData["User Type"].includes("admin");

  return isAdmin ? <>{children}</> : <Navigate to="/unauthorized" />;
};

const ReportsRoute = ({ children }: ProtectedRouteProps) => {
  const userData = JSON.parse(localStorage.getItem("token") || "null");
  const isReportUser = userData && Array.isArray(userData["User Type"]) &&
    userData["User Type"].includes("reports_user");

  return isReportUser ? <>{children}</> : <Navigate to="/unauthorized" />;
};

const InspectionRoute = ({ children }: ProtectedRouteProps) => {
  const userData = JSON.parse(localStorage.getItem("token") || "null");
  const isInspectionUser = userData && Array.isArray(userData["User Type"]) &&
    userData["User Type"].includes("inpection_user");

  return isInspectionUser ? <>{children}</> : <Navigate to="/unauthorized" />;
};

// Auth verification component
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem("token") !== null;
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function App(): JSX.Element {
  const itemData = useSelector((state: RootState) => state.ids);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Application states
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // List of routes where Navbar and Footer should be hidden
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
  const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);

  // Create and insert static loading element to prevent flash of UI
  useEffect(() => {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'app-loading-overlay';
    loadingDiv.setAttribute('style', staticLoadingStyle);
    loadingDiv.innerHTML = `
      <div style="text-align: center;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin-bottom: 20px;"></div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Loading Auditly.ai</div>
        <div style="color: #666;">Please wait...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loadingDiv);
    
    return () => {
      const overlay = document.getElementById('app-loading-overlay');
      if (overlay) document.body.removeChild(overlay);
    };
  }, []);

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          // No token, redirect to login
          if (!authRoutes.includes(location.pathname)) {
            navigate("/login", { replace: true });
          }
          setIsAuthenticated(false);
        } else {
          // Try to validate token
          const userData = JSON.parse(token);
          const res = await fetch("https://auditlyai.com/api/users");
          
          if (!res.ok) throw new Error("Failed to validate user");
          
          const data = await res.json();
          const userExists = data.data?.some((user: any) => 
            user?.user_name === userData["User Name"]);
          
          if (!userExists) {
            // Invalid user, redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("usertype");
            if (!authRoutes.includes(location.pathname)) {
              navigate("/login", { replace: true });
            }
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, assume not authenticated
        setIsAuthenticated(false);
      } finally {
        // Remove loading screen after authentication check
        setIsLoading(false);
        setTimeout(() => {
          const overlay = document.getElementById('app-loading-overlay');
          if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
              if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
              }
            }, 300);
          }
        }, 300); // Small delay to ensure routes are ready
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname, authRoutes]);

  // Don't render anything until initial auth check is complete
  if (isLoading) {
    return <></>;  // Return empty because we have the static loading overlay
  }

  return (
    <>
      {/* Only render Navbar if not on auth routes */}
      {!shouldHideNavbarAndFooter && <Navbar />}

      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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
          <ProtectedRoute>
            <InspectionRoute>
              <Home />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/options" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Options />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/help-center" element={
          <ProtectedRoute>
            <InspectionRoute>
              <HelpCenter />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/option/manual" element={
          <ProtectedRoute>
            <InspectionRoute>
              <GetAll />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/return/details" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Details />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/return/inspection" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Inspection />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/return/upload-media" element={
          <ProtectedRoute>
            <InspectionRoute>
              <UploadMedia />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/return/compare" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Compare />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/return/review" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Review />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/return/done" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Done />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        <Route path="/auto/scan" element={
          <ProtectedRoute>
            <InspectionRoute>
              <Scan />
            </InspectionRoute>
          </ProtectedRoute>
        } />
        
        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );
}
