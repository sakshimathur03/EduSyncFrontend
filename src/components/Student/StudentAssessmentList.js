import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const StudentAssessmentList = ({ onSelectAssessment }) => {
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
        const res = await api.get('/Assessments');
        const filtered = res.data.filter(a => a.courseId === selectedCourse.courseId);
        setAssessments(filtered);
      } catch {
        alert('Failed to load assessments.');
      }
    };
    fetchAssessments();
  }, [selectedCourse]);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredCourses(
      courses.filter(c => c.title.toLowerCase().includes(lower))
    );
  }, [searchTerm, courses]);

  return (
    <div className="container mt-4">
      <h4>Choose a Course to View Assessments</h4>
      <input
        className="form-control mb-3"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="list-group mb-4">
        {filteredCourses.map((course) => (
          <li
            key={course.courseId}
            className={`list-group-item ${selectedCourse?.courseId === course.courseId ? 'active' : ''}`}
            onClick={() => setSelectedCourse(course)}
            style={{ cursor: 'pointer' }}
          >
            {course.title}
          </li>
        ))}
      </ul>

      {selectedCourse && (
        <>
          <h5>Assessments for {selectedCourse.title}</h5>
          <ul className="list-group">
            {assessments.map((assessment) => (
              <li
                key={assessment.assessmentId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {assessment.title}
      <Link to={`/student/take-assessment/${assessment.assessmentId}`} className="btn btn-sm btn-success">
  Take
</Link>


              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default StudentAssessmentList;
