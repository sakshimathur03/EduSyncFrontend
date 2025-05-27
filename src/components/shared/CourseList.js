import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // ✅ use configured Axios instance

const CourseList = ({ onSelectCourse }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/Courses'); // ✅ Axios adds baseURL and auth header
        console.log("📘 Fetched courses:", res.data);
        setCourses(res.data);
      } catch (err) {
        console.error('❌ Error fetching courses:', err.response?.data || err.message);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="mt-3">Loading courses...</div>;
  if (error) return <div className="mt-3 text-danger">{error}</div>;
  if (courses.length === 0) return <div className="mt-3">No courses available.</div>;

  return (
    <div className="container mt-4">
      <h3>Available Courses</h3>
      <ul className="list-group">
        {courses.map((course) => (
          <li
            key={course.courseId}
            className="list-group-item list-group-item-action"
            style={{ cursor: onSelectCourse ? 'pointer' : 'default' }}
            onClick={() => onSelectCourse && onSelectCourse(course)}
          >
            <strong>{course.title}</strong>
            <p>{course.description}</p>
            {course.mediaUrl && (
              <a href={course.mediaUrl} target="_blank" rel="noreferrer">
                View Media
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
