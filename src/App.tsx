import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import Solution from "./pages/Solution";
import Process from "./pages/Process";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
// import Insights from "./pages/Insights";
import DetailInsights from "./pages/DetailInsights";
import ComingSoon from "./pages/ComingSoon";
import Company from "./pages/Company";
import Contact from "./pages/Contact";

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
import FooterEditor from "./pages/admin/home/FooterEditor";

// Solution Section Editors
import SolutionSection1Editor from "./pages/admin/solution/Section1Editor";
import SolutionSection2Editor from "./pages/admin/solution/Section2Editor";
import SolutionSection4Editor from "./pages/admin/solution/Section4Editor";

// Works Section Editors
import WorksSection1Editor from "./pages/admin/works/Section1Editor";
import WorksSection2Editor from "./pages/admin/works/Section2Editor";
import WorksSection3Editor from "./pages/admin/works/Section3Editor";

// Projects Section Editors
import ProjectsSection1Editor from "./pages/admin/projects/Section1Editor";
import ProjectsSection2Editor from "./pages/admin/projects/Section2Editor";
import ProjectsSection3Editor from "./pages/admin/projects/Section3Editor";

// FAQ Editor
import FAQEditor from "./pages/admin/faq/FAQEditor";

// Insights Section Editors
import AdminInsightsCategories from "./pages/admin/insights/AdminInsightsCategories";
import AdminInsightsPosts from "./pages/admin/insights/AdminInsightsPosts";

// Company Section Editors
import CompanySection1Editor from "./pages/admin/company/Section1Editor";
import CompanySection2Editor from "./pages/admin/company/Section2Editor";

// Contact Section Editor
import ContactCMS from "./pages/admin/contact/ContactCMS";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ScrollToHash />
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solution />} />
          <Route path="/process" element={<Process />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/insights" element={<ComingSoon />} />
          <Route path="/insights/:id" element={<DetailInsights />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />

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
            <Route path="dashboard" element={<AdminDashboard />} />

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
            <Route path="home/footer" element={<FooterEditor />} />

            {/* Solution Page Sections */}
            <Route
              path="solution/section1"
              element={<SolutionSection1Editor />}
            />
            <Route
              path="solution/section2"
              element={<SolutionSection2Editor />}
            />
            <Route
              path="solution/section4"
              element={<SolutionSection4Editor />}
            />

            {/* FAQ Page */}
            <Route path="faq" element={<FAQEditor />} />

            {/* Works Page Sections */}
            <Route path="works/section1" element={<WorksSection1Editor />} />
            <Route path="works/section2" element={<WorksSection2Editor />} />
            <Route path="works/section3" element={<WorksSection3Editor />} />

            {/* Projects Page Sections */}
            <Route
              path="projects/section1"
              element={<ProjectsSection1Editor />}
            />
            <Route
              path="projects/section2"
              element={<ProjectsSection2Editor />}
            />
            <Route
              path="projects/section3"
              element={<ProjectsSection3Editor />}
            />

            {/* Insights Page Sections */}
            <Route
              path="insights/section1"
              element={<AdminInsightsCategories />}
            />
            <Route path="insights/section2" element={<AdminInsightsPosts />} />

            {/* Company Page Sections */}
            <Route
              path="company/section1"
              element={<CompanySection1Editor />}
            />
            <Route
              path="company/section2"
              element={<CompanySection2Editor />}
            />

            {/* Contact Page Section */}
            <Route path="contact" element={<ContactCMS />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
