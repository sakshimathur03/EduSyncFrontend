import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const CourseList = ({ onSelectCourse }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/Courses');
        console.log("📘 Fetched courses:", res.data);
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err.response?.data || err.message);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Courses/${id}`);
      setCourses(prev => prev.filter(c => c.courseId !== id));
    } catch (err) {
      alert("Failed to delete course.");
    }
  };

  const isImage = (url) => /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(url);

  if (loading) return <div className="mt-3">⏳ Loading courses...</div>;
  if (error) return <div className="mt-3 text-danger">{error}</div>;
  if (courses.length === 0) return <div className="mt-3">No courses available.</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4" style={{ fontWeight: '600', color: '#2c3e50' }}>
        📚 Available Courses
      </h3>
      <div className="row">
        {courses.map((course) => (
          <div className="col-md-6 mb-4" key={course.courseId}>
            <div
              className="card h-100"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {course.mediaUrl && isImage(course.mediaUrl) ? (
                <img
                  src={course.mediaUrl}
                  alt="Course"
                  className="card-img-top"
                  style={{ maxHeight: '180px', objectFit: 'cover' }}
                />
              ) : course.mediaUrl ? (
                <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '180px' }}>
                  <a href={course.mediaUrl} target="_blank" rel="noreferrer">
                    View Media
                  </a>
                </div>
              ) : (
                <div className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white" style={{ height: '180px' }}>
                  No Media
                </div>
              )}

              <div className="card-body d-flex flex-column justify-content-between">
                <div onClick={() => onSelectCourse && onSelectCourse(course)} style={{ cursor: onSelectCourse ? 'pointer' : 'default' }}>
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-muted" style={{ minHeight: '60px' }}>{course.description}</p>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(course.courseId)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
