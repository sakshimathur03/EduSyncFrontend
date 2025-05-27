import React, { useState } from 'react';
import AssessmentList from './StudentAssessmentList';
import TakeAssessment from './TakeAssessment';

const StudentAssessmentPage = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const handleComplete = () => {
    alert("Assessment submitted!");
    setSelectedAssessment(null); // Return to list
  };

  return (
    <div>
      {!selectedAssessment ? (
        <AssessmentList onSelectAssessment={setSelectedAssessment} />
      ) : (
        <TakeAssessment assessment={selectedAssessment} onComplete={handleComplete} />
      )}
    </div>
  );
};

export default StudentAssessmentPage;
