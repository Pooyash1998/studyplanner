'use client';
import React, { useState } from 'react';

interface Module {
  id: string;
  name: string;
  offering: 'Winter' | 'Summer';
  hardness: 1 | 2 | 3;
  creditPoints: number;
}

interface Props {
  onAddModule: (newModule: Module) => void;
}

const ModuleForm: React.FC<Props> = ({ onAddModule }) => {
  const [name, setName] = useState('');
  const [offering, setOffering] = useState<'Winter' | 'Summer'>('Winter');
  const [hardness, setHardness] = useState<1 | 2 | 3>(1);
  const [creditPoints, setCreditPoints] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newModule: Module = {
      id: Date.now().toString(), // Simple ID
      name,
      offering,
      hardness,
      creditPoints,
    };

    onAddModule(newModule);

    // Clear form
    setName('');
    setOffering('Winter');
    setHardness(1);
    setCreditPoints(0);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <h3>Add a Module</h3>
      <input
        type="text"
        placeholder="Module Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      /><br />

      <label>
        Offering:
        <select value={offering} onChange={(e) => setOffering(e.target.value as 'Winter' | 'Summer')}>
          <option value="Winter">Winter</option>
          <option value="Summer">Summer</option>
        </select>
      </label><br />

      <label>
        Hardness (1-3):
        <input
          type="number"
          min={1}
          max={3}
          value={hardness}
          onChange={(e) => setHardness(Number(e.target.value) as 1 | 2 | 3)}
        />
      </label><br />

      <label>
        Credit Points:
        <input
          type="number"
          value={creditPoints}
          onChange={(e) => setCreditPoints(Number(e.target.value))}
        />
      </label><br />

      <button type="submit">Add Module</button>
    </form>
  );
};

export default ModuleForm;
