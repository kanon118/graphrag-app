import React from 'react';
import { uploadDocument } from './api';

function UploadView({ token }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadDocument(file, token);
      alert('Fil uppladdad och processad!');
    }
  };

  return (
    <div className="p-4">
      <h2>Ladda upp dokument</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default UploadView;
