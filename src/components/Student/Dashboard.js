import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mt-5">
      <h2>Student Dashboard</h2>
      <div className="d-flex flex-column gap-3" style={{ maxWidth: '300px' }}>
        <Link to="/student/assessments-list" className="btn btn-primary">
          Take Assessment
        </Link>
        <Link to="/student/results" className="btn btn-secondary">
          View Results
        </Link>
        <Link to="/shared/courses-list" className="btn btn-info">
          View Courses
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
