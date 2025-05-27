import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Instructor Dashboard</h2>
      <div className="d-flex flex-column gap-3" style={{ maxWidth: '300px' }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/instructor/upload-course')}
        >
          Upload Course
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/instructor/upload-assessment')}
        >
          Upload Assessment
        </button>

        <button
          className="btn btn-outline-info"
          onClick={() => navigate('/shared/courses-list')}
        >
          View Courses
        </button>

        <button
          className="btn btn-outline-info"
          onClick={() => navigate('/shared/assessments-list')}
        >
          View Assessments
        </button>
      </div>
    </div>
  );
};

export default InstructorDashboard;
