import React from "react";
import { Routes, Route } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";
import { CompanyProvider } from "./context/CompanyContext";
import StudentProtectedWrapper from "./components/StudentProtectedWrapper";
import CompanyProtectedWrapper from "./components/CompanyProtectedWrapper";
import Home from "./pages/Home";
import StudentHome from "./pages/StudentHome";
import CompanyHome from "./pages/CompanyHome";
import JobApplicants from "./pages/JobApplicants";
import ComposeEmail from "./pages/ComposeEmail";

const App = () => {
  return (
    <StudentProvider>
      <CompanyProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/student/*"
            element={
              <StudentProtectedWrapper>
                <StudentHome />
              </StudentProtectedWrapper>
            }
          />
          <Route
            path="/company/*"
            element={
              <CompanyProtectedWrapper>
                <Routes>
                  <Route path="dashboard" element={<CompanyHome />} />
                  <Route
                    path="jobs/:jobId/applicants"
                    element={<JobApplicants />}
                  />
                  <Route path="compose-email" element={<ComposeEmail />} />
                </Routes>
              </CompanyProtectedWrapper>
            }
          />
        </Routes>
      </CompanyProvider>
    </StudentProvider>
  );
};

export default App;
