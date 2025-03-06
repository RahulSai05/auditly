import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
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
import WithRole from "./components/auth/WithRole";
import WithNonAdminRole from "./components/auth/WithNonAdminRole"; 
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/Forgot";
import ResetPassword from "./components/auth/Reset";
import EditProfile from "./components/auth/EditProfile";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import { RootState } from "./store/store";

export default function App() {
  const itemData = useSelector((state: RootState) => state.ids);
  const navigate = useNavigate();
  const location = useLocation();

  // List of routes where Navbar and Footer should be hidden
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/edit-profile"];
  const shouldHideNavbarAndFooter = authRoutes.includes(location.pathname);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    // Redirect to login only if not on auth-related routes
    if (
      !isLoggedIn &&
      !authRoutes.includes(currentPath)
    ) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log(itemData);
  }, [itemData]);

  return (
    <>
      {/* Conditionally render Navbar */}
      {!shouldHideNavbarAndFooter && <Navbar />}

      <Routes>
        {/* Non-Admin Routes */}
        <Route
          path="/"
          element={
            <WithNonAdminRole>
              <Home />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/options"
          element={
            <WithNonAdminRole>
              <Options />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/help-center"
          element={
            <WithNonAdminRole>
              <HelpCenter />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/option/manual"
          element={
            <WithNonAdminRole>
              <GetAll />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/return/details"
          element={
            <WithNonAdminRole>
              <Details />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/return/inspection"
          element={
            <WithNonAdminRole>
              <Inspection />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/return/upload-media"
          element={
            <WithNonAdminRole>
              <UploadMedia />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/return/compare"
          element={
            <WithNonAdminRole>
              <Compare />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/return/review"
          element={
            <WithNonAdminRole>
              <Review />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/return/done"
          element={
            <WithNonAdminRole>
              <Done />
            </WithNonAdminRole>
          }
        />
        <Route
          path="/auto/scan"
          element={
            <WithNonAdminRole>
              <Scan />
            </WithNonAdminRole>
          }
        />
        

        {/* Admin Routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <Dashboard />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/Item-master-upload"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <ItemUpload />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/Item-Image-Upload"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <ItemImageUpload />
              </WithRole>
            }
          />
          <Route
            path="/admin/reports/items"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <DashboardTables />
              </WithRole>
            }
          />
          <Route
            path="/admin/reports/customer-serials"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <CustomerSerials />
              </WithRole>
            }
          />
          <Route
            path="/admin/reports/returns"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <ReturnDetails />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/Return-Upload"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <ItemReturn />
              </WithRole>
            }
          />
          <Route
            path="/admin/reports/audity-inspections"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <AuditlyInspection />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/customer-serial-Upload"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <CustomerSerialUpload />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/users-maintenance"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <UserMaintenance />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/connectors/inbound"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <Inbound />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/connectors/outbound"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <Outbound />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/email-configurations"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <EmailConfigurations />
              </WithRole>
            }
          />
          <Route
            path="/admin/settings/api-configurations"
            element={
              <WithRole allowedRoles={["admin", "super_user"]}>
                <ApiConfigurations />
              </WithRole>
            }
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/inspection-data" element={<InspectionData />} />



        
      </Routes>

      {/* Conditionally render Footer */}
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );
}
