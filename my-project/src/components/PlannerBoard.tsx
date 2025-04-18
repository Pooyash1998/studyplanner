// src/app/components/PlannerBoard.tsx
import React, { useState } from 'react';
import ModuleForm from './ModuleForm';
import ModuleCard from './ModuleCard';
import AIControls from './AIControls';
import SettingsModal from './SettingsModal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Module {
  id: string;
  name: string;
  offering: 'Winter' | 'Summer';
  hardness: 1 | 2 | 3;
  creditPoints: number;
  semester?: number;
  frozen?: boolean;
}

interface SemesterConfig {
  id: number;
  type: 'Winter' | 'Summer';
  hardnessLimit: number;
}

const initialSemesterSettings: SemesterConfig[] = [
  { id: 1, type: 'Winter', hardnessLimit: 5 },
  { id: 2, type: 'Summer', hardnessLimit: 5 },
  { id: 3, type: 'Winter', hardnessLimit: 5 },
  { id: 4, type: 'Summer', hardnessLimit: 5 },
];

const PlannerBoard: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [semesterSettings] = useState<SemesterConfig[]>(initialSemesterSettings);

  const handleAddModule = (newModule: Module) => {
    setModules((prev) => [...prev, newModule]);
  };

  const toggleFrozen = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, frozen: !m.frozen } : m
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const module = modules.find((m) => m.id === draggableId);
    if (!module || module.frozen) {
      alert(`❄️ Module "${module?.name}" is frozen and cannot be moved.`);
      return;
    }

    const from = source.droppableId;
    const to = destination.droppableId;

    const toSemester = to === 'unassigned' ? undefined : parseInt(to);

    if (toSemester) {
      const semester = semesterSettings.find((s) => s.id === toSemester);
      if (!semester) return;

      if (module.offering !== semester.type) {
        alert(`❌ "${module.name}" is only offered in ${module.offering} semester.`);
        return;
      }

      const semesterModules = modules.filter(
        (m) => m.semester === toSemester && m.id !== module.id
      );
      const totalHardness = semesterModules.reduce((sum, m) => sum + m.hardness, 0);

      if (totalHardness + module.hardness > semester.hardnessLimit) {
        alert(`⚠️ Semester ${toSemester} exceeds hardness limit (${semester.hardnessLimit}).`);
        return;
      }
    }

    setModules((prev) =>
      prev.map((m) =>
        m.id === module.id ? { ...m, semester: toSemester } : m
      )
    );
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>📚 StudyWise Planner</h2>
      <ModuleForm onAddModule={handleAddModule} />
      <AIControls />
      <SettingsModal />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ margin: '2rem 0' }}>
          <h3>Unassigned Modules</h3>
          <Droppable droppableId="unassigned">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  border: '1px dashed #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                  minHeight: '100px',
                  backgroundColor: '#f0f0f0',
                }}
              >
                {modules
                  .filter((m) => !m.semester)
                  .map((mod, index) => (
                    <ModuleCard key={mod.id} module={mod} onFreezeToggle={toggleFrozen} />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {semesterSettings.map((semester) => (
            <Droppable key={semester.id} droppableId={semester.id.toString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    minHeight: '200px',
                  }}
                >
                  <h4>
                    Semester {semester.id} ({semester.type})<br />
                    🔥 Limit: {semester.hardnessLimit}
                  </h4>
                  {modules
                    .filter((m) => m.semester === semester.id)
                    .map((mod, index) => (
                      <ModuleCard key={mod.id} module={mod} onFreezeToggle={toggleFrozen} />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default PlannerBoard;
