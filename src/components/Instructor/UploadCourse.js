import React, { useState } from 'react';
import api from '../../services/api';

const UploadCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      // Upload media file
      const formData = new FormData();
      formData.append('file', mediaFile);
      const mediaResponse = await api.post('/Media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const mediaUrl = mediaResponse.data.url;

      // Create course
      await api.post('/Courses', {
        title,
        description,
        mediaUrl,
      });

      alert('Course uploaded successfully');
    } catch (error) {
      alert('Failed to upload course');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload Course</h2>
      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label>Title:</label>
          <input type="text" className="form-control" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Description:</label>
          <textarea className="form-control" value={description}
            onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Media File:</label>
          <input type="file" className="form-control" onChange={(e) => setMediaFile(e.target.files[0])} required />
        </div>
        <button className="btn btn-primary" type="submit">Upload Course</button>
      </form>
    </div>
  );
};

export default UploadCourse;
