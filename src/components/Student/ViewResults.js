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
  const [loading, setLoading] = useState(true);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/Results');
        const filtered = res.data.filter(r => String(r.userId) === String(userId));

        // For each result, fetch its corresponding assessment
        const enrichedResults = await Promise.all(
          filtered.map(async (result) => {
            try {
              const assessmentRes = await api.get(`/Assessments/${result.assessmentId}`);
              return {
                ...result,
                assessmentTitle: assessmentRes.data?.title || 'Untitled Assessment',
              };
            } catch {
              return {
                ...result,
                assessmentTitle: 'Assessment not found',
              };
            }
          })
        );

        setResults(enrichedResults);
      } catch (error) {
        console.error('Failed to load results:', error);
        alert('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchResults();
  }, [userId]);

  if (loading) return <p>Loading results...</p>;

  return (
    <div className="container mt-4">
      <h3>Your Assessment Results</h3>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="list-group">
          {results.map(r => (
            <li key={r.resultId} className="list-group-item">
              {r.assessmentTitle} — Score: {r.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewResults;
