import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useEffect } from "react";
import Home from "./pages/Home";
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
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/Forgot";
import ResetPassword from "./components/auth/Reset";

export default function App() {
  const itemData = useSelector((state: RootState) => state.ids);
  const isLoggedIn = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    console.log(itemData);
  }, [itemData]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
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
          <Route path="/admin/item-upload" element={<ItemUpload />} />
          <Route
            path="/admin/item-image-upload"
            element={<ItemImageUpload />}
          />
          <Route path="/admin/dashboard-tables" element={<DashboardTables />} />
          <Route path="/admin/item-return" element={<ItemReturn />} />
        </Route>

        {/* Auto */}
        <Route path="/auto/scan" element={<Scan />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </>
  );
}
