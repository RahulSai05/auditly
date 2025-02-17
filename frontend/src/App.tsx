// import { Route, Routes, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import Home from "./pages/Home";
// import Options from "./pages/Options";
// import GetAll from "./pages/manual/GetAll";
// import Details from "./pages/manual/return /Details";
// import Inspection from "./pages/manual/return /Inspection";
// import UploadMedia from "./pages/manual/return /Uploadmedia";
// import Compare from "./pages/manual/return /Compare";
// import Review from "./pages/manual/return /Review";
// import Done from "./pages/manual/return /Done";
// import Scan from "./pages/auto/Scan";
// import Dashboard from "./pages/admin/Dashboard";
// import DashboardTables from "./pages/admin/DashboardTables";
// import ItemUpload from "./pages/admin/ItemUpload";
// import ItemImageUpload from "./pages/admin/ItemImageUpload";
// import AdminLayout from "./components/AdminLayout";
// import ItemReturn from "./pages/admin/ItemReturn";
// import CustomerSerials from "./pages/admin/CustomerSerials";
// import ReturnDetails from "./components/ReturnDetails";
// import AuditlyInspection from "./pages/admin/AuditlyInspection";
// import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";
// import ForgotPassword from "./components/auth/Forgot";
// import ResetPassword from "./components/auth/Reset";
// import { Navbar } from "./components/Navbar";
// import Footer from "./components/Footer";

// export default function App() {
//   const itemData = useSelector((state: RootState) => state.ids);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("token");
//     const currentPath = window.location.pathname;

//     // Redirect to login only if not on auth-related routes
//     if (!isLoggedIn && !["/register", "/login", "/forgot-password", "/reset-password"].includes(currentPath)) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     console.log(itemData);
//   }, [itemData]);

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/options" element={<Options />} />
//         <Route path="/option/manual" element={<GetAll />} />
//         <Route path="/return/details" element={<Details />} />
//         <Route path="/return/inspection" element={<Inspection />} />
//         <Route path="/return/upload-media" element={<UploadMedia />} />
//         <Route path="/return/compare" element={<Compare />} />
//         <Route path="/return/review" element={<Review />} />
//         <Route path="/return/done" element={<Done />} />

//         {/* Admin Routes with AdminLayout */}
//         <Route element={<AdminLayout />}>
//           <Route path="/admin/dashboard" element={<Dashboard />} />
//           <Route path="/admin/settings/Item master upload" element={<ItemUpload />} />
//           <Route path="/admin/settings/Item Image Upload" element={<ItemImageUpload />} />
//           <Route path="/admin/reports/items" element={<DashboardTables />} />
//           <Route path="/admin/reports/customer-serials" element={<CustomerSerials />} />
//           <Route path="/admin/reports/returns" element={<ReturnDetails />} />
//           <Route path="/admin/settings/Return Upload" element={<ItemReturn />} />
//           <Route path="/admin/reports/audity-inspections" element={<AuditlyInspection />} />
//         </Route>

//         {/* Auto */}
//         <Route path="/auto/scan" element={<Scan />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// }


import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/Home";
import Options from "./pages/Options";
import GetAll from "./pages/manual/GetAll";
import Details from "./pages/manual/return/Details";
import Inspection from "./pages/manual/return/Inspection";
import UploadMedia from "./pages/manual/return/UploadMedia";
import Compare from "./pages/manual/return/Compare";
import Review from "./pages/manual/return/Review";
import Done from "./pages/manual/return/Done";
import Scan from "./pages/auto/Scan";
import Dashboard from "./pages/admin/Dashboard";
import DashboardTables from "./pages/admin/DashboardTables";
import ItemUpload from "./pages/admin/ItemUpload";
import AdminLayout from "./components/AdminLayout";
import ItemReturn from "./pages/admin/ItemReturn";
import CustomerSerials from "./pages/admin/CustomerSerials";
import ReturnDetails from "./components/ReturnDetails";
import AuditlyInspection from "./pages/admin/AuditlyInspection";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/Forgot";
import ResetPassword from "./components/auth/Reset";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

// New Pages for Admin Panel
import Inbound from "./pages/admin/connectors/Inbound";
import Outbound from "./pages/admin/connectors/Outbound";
import EmailConfigurations from "./pages/admin/settings/EmailConfigurations";
import ApiConfigurations from "./pages/admin/settings/ApiConfigurations";
import UsersMaintenance from "./pages/admin/settings/UsersMaintenance";
import ItemMasterUpload from "./pages/admin/maintenance/ItemMasterUpload";
import CustomerSerialUpload from "./pages/admin/maintenance/CustomerSerialUpload";
import ItemImageUpload from "./pages/admin/maintenance/ItemImageUpload";
import ReturnUpload from "./pages/admin/maintenance/ReturnUpload";

export default function App() {
  const itemData = useSelector((state: RootState) => state.ids);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    // Redirect to login only if not on auth-related routes
    if (!isLoggedIn && !["/register", "/login", "/forgot-password", "/reset-password"].includes(currentPath)) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log(itemData);
  }, [itemData]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />

        {/* Manual Return Routes */}
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
          <Route path="/admin/reports/items" element={<DashboardTables />} />
          <Route path="/admin/reports/customer-serials" element={<CustomerSerials />} />
          <Route path="/admin/reports/returns" element={<ReturnDetails />} />
          <Route path="/admin/reports/audity-inspections" element={<AuditlyInspection />} />

          {/* Settings Routes */}
          <Route path="/admin/settings/email-configurations" element={<EmailConfigurations />} />
          <Route path="/admin/settings/api-configurations" element={<ApiConfigurations />} />
          <Route path="/admin/settings/users-maintenance" element={<UsersMaintenance />} />

          {/* Connectors Routes */}
          <Route path="/admin/reports/customer-serials/inbound" element={<Inbound />} />
          <Route path="/admin/reports/customer-serials/outbound" element={<Outbound />} />

          {/* Maintenance Routes */}
          <Route path="/admin/maintenance/item-master-upload" element={<ItemMasterUpload />} />
          <Route path="/admin/maintenance/customer-serial-upload" element={<CustomerSerialUpload />} />
          <Route path="/admin/maintenance/item-image-upload" element={<ItemImageUpload />} />
          <Route path="/admin/maintenance/return-upload" element={<ReturnUpload />} />
        </Route>

        {/* Auto Scan Route */}
        <Route path="/auto/scan" element={<Scan />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Fallback Route for Undefined Paths */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
}
