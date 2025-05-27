import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UploadAssessment = () => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [questions, setQuestions] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [courses, setCourses] = useState([]);

  // JSON example string to show in UI
  const exampleJson = `[{"question":"What is 2+2?","options":["3","4","5"],"answer":"4"}]`;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/Courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate JSON input
    try {
      JSON.parse(questions);
    } catch {
      alert('Questions field contains invalid JSON');
      return;
    }

    if (!courseId) {
      alert('Please select a course');
      return;
    }

    try {
      await api.post('/Assessments', {
        title,
        courseId,
        questions, // send as string (JSON string)
        maxScore: parseInt(maxScore),
      });
      alert('Assessment uploaded successfully');
      // Clear form after success
      setTitle('');
      setCourseId('');
      setQuestions('');
      setMaxScore('');
    } catch (error) {
      console.error('Upload failed:', error.response || error.message);
      alert('Failed to upload assessment');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload Assessment</h2>
      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Course:</label>
          <select
            className="form-control"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Questions (JSON format):</label>
          <textarea
            className="form-control"
            rows={8}
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            required
          />
          <small className="form-text text-muted">
            Enter valid JSON, e.g. {exampleJson}
          </small>
        </div>
        <div className="mb-3">
          <label>Max Score:</label>
          <input
            type="number"
            className="form-control"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Upload Assessment
        </button>
      </form>
    </div>
  );
};

export default UploadAssessment;
