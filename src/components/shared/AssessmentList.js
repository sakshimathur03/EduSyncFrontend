import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AssessmentList = ({ onSelectAssessment }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/Courses');
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch {
        alert('Failed to load courses.');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchAssessments = async () => {
      try {
        // Assuming your backend expects courseId as query param
        const res = await api.get(`/Assessments?courseId=${selectedCourse.courseId}`);
        setAssessments(res.data);
      } catch {
        alert('Failed to load assessments.');
      }
    };
    fetchAssessments();
  }, [selectedCourse]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredCourses(
      courses.filter(c => c.title.toLowerCase().includes(term))
    );
  }, [searchTerm, courses]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();  // Prevent card click event

    const confirmDelete = window.confirm("Are you sure you want to delete this assessment?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Assessments/${id}`);
      setAssessments(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Failed to delete assessment.');
    }
  };

  return (
    <div className="container mt-4">
      <h3 style={{ fontWeight: '600', color: '#333', marginBottom: '20px' }}>
        📘 Select a Course to View Assessments
      </h3>

      <input
        className="form-control mb-4"
        placeholder="🔍 Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', borderRadius: '8px' }}
      />

      <div className="row mb-4">
        {filteredCourses.map((course) => (
          <div className="col-md-4 mb-3" key={course.courseId}>
            <div
              className={`card h-100 ${selectedCourse?.courseId === course.courseId ? 'border-primary' : ''}`}
              onClick={() => setSelectedCourse(course)}
              style={{
                cursor: 'pointer',
                transition: '0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '12px'
              }}
            >
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text text-muted">Click to view assessments</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <>
          <h4 className="mb-3" style={{ color: '#007bff' }}>
            📄 Assessments for <strong>{selectedCourse.title}</strong>
          </h4>
          <div className="row">
            {assessments.map((a) => (
              <div className="col-md-6 mb-3" key={a.id}>
                <div
                  className="card"
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '15px',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectAssessment && onSelectAssessment(a)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      style={{ fontSize: '18px', fontWeight: '500' }}
                    >
                      {a.title}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => handleDelete(a.id, e)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentList;
