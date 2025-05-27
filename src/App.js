import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole, clearToken } from './services/auth';

import AuthLogin from './components/Auth/Login';
import Register from './components/Auth/Register';

import InstructorDashboard from './components/Instructor/Dashboard';
import UploadCourse from './components/Instructor/UploadCourse';
import UploadAssessment from './components/Instructor/UploadAssessment';

import StudentDashboard from './components/Student/Dashboard';
import StudentAssessmentPage from './components/Student/StudentAssessmentPage';
import ViewResults from './components/Student/ViewResults';

import CourseList from './components/shared/CourseList';
import AssessmentList from './components/shared/AssessmentList';
import TakeAssessment from './components/Student/TakeAssessment';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userId, setUserId] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    if (role) {
      setUserRole(role);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const PrivateRoute = ({ children, role }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (role) {
      const allowedRoles = Array.isArray(role) ? role : [role];
      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/login" />;
      }
    }
    return children;
  };
  useEffect(() => {
  const role = getUserRole();
  const id = localStorage.getItem('userId');
  if (role) {
    setUserRole(role);
    setUserId(id);  // <-- You need to declare setUserId with useState
    setIsLoggedIn(true);
  }
}, []);


  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">EduSync LMS</a>
          {isLoggedIn && (
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>

      <Routes>
        {/* Auth */}
        <Route path="/login" element={
          isLoggedIn ? (
            userRole === 'Instructor' ? <Navigate to="/instructor" /> : <Navigate to="/student" />
          ) : (
            <AuthLogin onLogin={(role) => {
              setUserRole(role);
              setIsLoggedIn(true);
            }} />
          )
        } />
        <Route path="/register" element={<Register />} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={
          <PrivateRoute role="Instructor">
            <InstructorDashboard />
          </PrivateRoute>
        } />
        <Route path="/instructor/upload-course" element={
          <PrivateRoute role="Instructor">
            <UploadCourse />
          </PrivateRoute>
        } />
        <Route path="/instructor/upload-assessment" element={
          <PrivateRoute role="Instructor">
            <UploadAssessment />
          </PrivateRoute>
        } />

        {/* Student Routes */}
        <Route path="/student" element={
          <PrivateRoute role="Student">
            <StudentDashboard />
          </PrivateRoute>
        } />
        <Route path="/student/assessments-list" element={
          <PrivateRoute role="Student">
            <StudentAssessmentPage />
          </PrivateRoute>
        } />
        <Route path="/student/results" element={
          <PrivateRoute role="Student">
            <ViewResults />
          </PrivateRoute>
        } />

        {/* Shared for Both Roles */}
        <Route path="/shared/courses-list" element={
          <PrivateRoute role={["Instructor", "Student"]}>
            <CourseList />
          </PrivateRoute>
        } />
        <Route path="/shared/assessments-list" element={
          <PrivateRoute role={["Instructor", "Student"]}>
            <AssessmentList />
          </PrivateRoute>
        } />
        <Route path="/student/take-assessment/:id" element={<TakeAssessment userId={userId} />} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
