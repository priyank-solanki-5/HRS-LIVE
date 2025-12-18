import React, { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Academics from "./pages/Academics.jsx";
import Admissions from "./pages/Admissions.jsx";
import AdmissionsApply from "./pages/AdmissionsApply.jsx";
import Events from "./pages/Events.jsx";
import Transportation from "./pages/Transportation.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import GamesSports from "./pages/GamesSports.jsx";
import Career from "./pages/Career.jsx";
import Footer from "./components/Footer";
import AddEvent from "./pages/admin/AddEvent.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminPanel from "./pages/admin/AdminPanel.jsx";
import AdminAdmissions from "./pages/admin/AdminAdmissions.jsx";
import AdminCareer from "./pages/admin/AdminCareer.jsx";
import AdminAcademics from "./pages/admin/AdminAcademics.jsx";
import AdminEmployees from "./pages/admin/AdminEmployees.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import AdminParents from "./pages/admin/AdminParents.jsx";
import AdminContact from "./pages/admin/AdminContact.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminActivities from "./pages/admin/AdminActivities.jsx";
import CurricularActivities from "./pages/activities/CurricularActivities.jsx";
import CoCurricularActivities from "./pages/activities/CoCurricularActivities.jsx";
import ExtraCurricularActivities from "./pages/activities/ExtraCurricularActivities.jsx";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminDashboard = location.pathname.startsWith("/admin/dashboard");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <>
      <link rel="icon" type="image/png" href="/logo.png" />
      <title>Holy Redeemer School</title>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/admissions/apply" element={<AdmissionsApply />} />
        <Route path="/events" element={<Events />} />
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/games-sports" element={<GamesSports />} />
        <Route
          path="/activities/curricular"
          element={<CurricularActivities />}
        />
        <Route
          path="/activities/co-curricular"
          element={<CoCurricularActivities />}
        />
        <Route
          path="/activities/extra-curricular"
          element={<ExtraCurricularActivities />}
        />
        <Route path="/career" element={<Career />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin/dashboard" element={<AdminPanel />}>
            <Route index element={<AdminHome />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="events" element={<AddEvent />} />
            <Route path="admissions" element={<AdminAdmissions />} />
            <Route path="career" element={<AdminCareer />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="academics" element={<AdminAcademics />} />
            <Route path="activities" element={<AdminActivities />} />
            <Route path="parents" element={<AdminParents />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
