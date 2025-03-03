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
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/option/manual" element={<GetAll />} />
        <Route path="/return/details" element={<Details />} />
        <Route path="/return/inspection" element={<Inspection />} />
        <Route path="/return/upload-media" element={<UploadMedia />} />
        <Route path="/return/compare" element={<Compare />} />
        <Route path="/return/review" element={<Review />} />
        <Route path="/return/done" element={<Done />} />

        {/* Admin Routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route
            path="/admin/settings/Item-master-upload"
            element={<ItemUpload />}
          />
          <Route
            path="/admin/settings/Item-Image-Upload"
            element={<ItemImageUpload />}
          />
          <Route path="/admin/reports/items" element={<DashboardTables />} />
          <Route
            path="/admin/reports/customer-serials"
            element={<CustomerSerials />}
          />
          <Route path="/admin/reports/returns" element={<ReturnDetails />} />
          <Route
            path="/admin/settings/Return-Upload"
            element={<ItemReturn />}
          />
          <Route
            path="/admin/reports/audity-inspections"
            element={<AuditlyInspection />}
          />
          <Route
            path="/admin/settings/customer-serial-Upload"
            element={<CustomerSerialUpload />}
          />
          <Route
            path="/admin/settings/users-maintenance"
            element={<UserMaintenance />}
          />
          <Route
            path="/admin/settings/connectors/inbound"
            element={<Inbound />}
          />
          <Route
            path="/admin/settings/connectors/outbound"
            element={<Outbound />}
          />
          <Route
            path="/admin/settings/email-configurations"
            element={<EmailConfigurations />}
          />
          <Route
            path="/admin/settings/api-configurations"
            element={<ApiConfigurations />}
          />
        </Route>

        {/* Auto */}
        <Route path="/auto/scan" element={<Scan />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>

      {/* Conditionally render Footer */}
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );
}
