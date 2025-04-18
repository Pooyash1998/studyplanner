// src/app/components/ModuleCard.tsx
import React from 'react';

interface Module {
  id: string;
  name: string;
  offering: 'Winter' | 'Summer';
  hardness: 1 | 2 | 3;
  creditPoints: number;
  frozen?: boolean;
}

interface Props {
  module: Module;
  onFreezeToggle: (moduleId: string) => void;
}

const ModuleCard: React.FC<Props> = ({ module, onFreezeToggle }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '0.5rem',
        backgroundColor: module.frozen ? '#e6f7ff' : '#ffffff',
      }}
    >
      <strong>{module.name}</strong>
      <div>Offering: {module.offering}</div>
      <div>Hardness: {module.hardness}</div>
      <div>Credits: {module.creditPoints}</div>
      <button onClick={() => onFreezeToggle(module.id)}>
        {module.frozen ? 'Unfreeze ❄️' : 'Freeze 🔒'}
      </button>
    </div>
  );
};

export default ModuleCard;
