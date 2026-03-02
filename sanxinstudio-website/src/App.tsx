import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";

// Home Section Editors
import HeaderEditor from "./pages/admin/home/HeaderEditor";
import HeroEditor from "./pages/admin/home/HeroEditor";
import Section2Editor from "./pages/admin/home/Section2Editor";
import Section3Editor from "./pages/admin/home/Section3Editor";
import Section4Editor from "./pages/admin/home/Section4Editor";
import Section5Editor from "./pages/admin/home/Section5Editor";
import Section6Editor from "./pages/admin/home/Section6Editor";
import Section7Editor from "./pages/admin/home/Section7Editor";
import Section8Editor from "./pages/admin/home/Section8Editor";
import Section9Editor from "./pages/admin/home/Section9Editor";
import FooterEditor from "./pages/admin/home/FooterEditor";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<Home />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Dashboard (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            {/* Home Page Sections */}
            <Route path="home/header" element={<HeaderEditor />} />
            <Route path="home/hero" element={<HeroEditor />} />
            <Route path="home/section2" element={<Section2Editor />} />
            <Route path="home/section3" element={<Section3Editor />} />
            <Route path="home/section4" element={<Section4Editor />} />
            <Route path="home/section5" element={<Section5Editor />} />
            <Route path="home/section6" element={<Section6Editor />} />
            <Route path="home/section7" element={<Section7Editor />} />
            <Route path="home/section8" element={<Section8Editor />} />
            <Route path="home/section9" element={<Section9Editor />} />
            <Route path="home/footer" element={<FooterEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
