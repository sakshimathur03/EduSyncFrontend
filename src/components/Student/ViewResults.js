import React, { useEffect, useState } from 'react';
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

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const userId = getUserIdFromToken(); // <- use same method

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/Results');
        const filtered = res.data.filter(r => String(r.userId) === String(userId));
        setResults(filtered);
      } catch (error) {
        console.error('Failed to load results:', error);
        alert('Failed to load results.');
      }
    };

    if (userId) fetchResults();
  }, [userId]);

  return (
    <div className="container mt-4">
      <h3>Your Assessment Results</h3>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="list-group">
          {results.map(r => (
            <li key={r.resultId} className="list-group-item">
              Assessment ID: {r.assessmentId} | Score: {r.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewResults;
