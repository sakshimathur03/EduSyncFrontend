import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/Assessments/${assessmentId}`);
        let parsedQuestions = [];

        if (res.data?.questions) {
          if (typeof res.data.questions === 'string') {
            parsedQuestions = JSON.parse(res.data.questions);
          } else {
            parsedQuestions = res.data.questions;
          }
        }

        setAssessment(res.data);
        setQuestions(parsedQuestions);
      } catch (err) {
        setError('Failed to load assessment.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('User not authenticated');
      navigate('/login');
      return;
    }

    let score = 0;
    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== undefined && q.Options[selected] === q.Answer) {
        score++;
      }
    });

    const resultDto = {
      assessmentId,
      userId,
      score
    };

    console.log("Submitting resultDto:", resultDto); // Debug log

    try {
      await api.post('/Results', resultDto);
      alert('Assessment submitted!');
      navigate('/results');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      alert('Submission failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>Loading assessment...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>{assessment.title}</h3>
      <form>
        {questions.map((q, i) => (
          <div key={i} className="mb-3">
            <label className="form-label">{q.Question}</label>
            {q.Options.map((opt, j) => (
              <div key={j} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${i}`}
                  id={`question-${i}-option-${j}`}
                  value={j}
                  checked={answers[i] === j}
                  onChange={() => handleChange(i, j)}
                />
                <label htmlFor={`question-${i}-option-${j}`} className="form-check-label">{opt}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          Submit Assessment
        </button>
      </form>
    </div>
  );
};

export default TakeAssessment;
