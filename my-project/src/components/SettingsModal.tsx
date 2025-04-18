// src/app/components/SettingsModal.tsx
import React, { useState } from 'react';

const SettingsModal: React.FC = () => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    localStorage.setItem('apiKey', apiKey); // Save API key to localStorage
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>API Key: </label>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={handleSave}>Save API Key</button>
    </div>
  );
};

export default SettingsModal;
