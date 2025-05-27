import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

// ✅ Correct helper to extract userId from JWT token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // ✅ Microsoft-style claim key for userId:
    const userIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    return payload[userIdClaim] || null;
  } catch (err) {
    console.error('Invalid token format:', err);
    return null;
  }
};

const TakeAssessment = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/Assessments/${assessmentId}`);
        const parsedQuestions = typeof res.data.questions === 'string'
          ? JSON.parse(res.data.questions)
          : res.data.questions;

        setAssessment(res.data);
        setQuestions(parsedQuestions || []);
      } catch (error) {
        alert('Failed to load assessment.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, navigate]);

  const handleChange = (questionIndex, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    const userId = getUserIdFromToken();
    console.log("Extracted User ID:", userId);

    if (!userId) {
      alert('User ID missing. Please log in.');
      navigate('/login');
      return;
    }

    // Basic scoring logic
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    const resultDto = {
      assessmentId,
      userId,
      score
    };

    try {
      await api.post('/Results', resultDto);
      alert('Assessment submitted successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('Failed to submit assessment.');
    }
  };

  if (loading) return <p>Loading assessment...</p>;
  if (!assessment) return <p>Assessment not found.</p>;

  return (
    <div className="container mt-4">
      <h3>{assessment.title}</h3>
      <form>
        {questions.map((q, index) => (
          <div key={index} className="mb-3">
            <label className="form-label">{q.question}</label>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${index}`}
                  id={`question-${index}-option-${optIndex}`}
                  value={optIndex}
                  checked={answers[index] === optIndex}
                  onChange={() => handleChange(index, optIndex)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`question-${index}-option-${optIndex}`}
                >
                  {opt}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit Assessment
        </button>
      </form>
    </div>
  );
};

export default TakeAssessment;
