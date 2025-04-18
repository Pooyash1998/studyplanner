
import React from "react";
import { Semester } from "../types";
import Module from "./Module";
import { Snowflake, Sun } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";

interface SemesterColumnProps {
  semester: Semester;
  index: number;
  onToggleFrozen: (moduleId: string) => void;
  onUpdateModule: (updatedModule: any) => void;
  onDeleteModule: (moduleId: string) => void;
  draggingModuleId: string | null;
}

const SemesterColumn: React.FC<SemesterColumnProps> = ({
  semester,
  index,
  onToggleFrozen,
  onUpdateModule,
  onDeleteModule,
  draggingModuleId
}) => {
  const currentHardnessSum = semester.modules.reduce(
    (sum, module) => sum + module.hardness,
    0
  );

  return (
    <div className={`semester-column semester-${index + 1} flex flex-col h-full`}>
      <div className="mb-3">
        <h2 className="font-semibold text-base flex items-center">
          {semester.name}
          {semester.type === "Winter" ? (
            <Snowflake className="ml-2 h-4 w-4 text-blue-500" />
          ) : (
            <Sun className="ml-2 h-4 w-4 text-yellow-500" />
          )}
        </h2>
        <div className="text-xs text-muted-foreground">
          (Hardness: {currentHardnessSum}/{semester.hardnessLimit})
        </div>
      </div>

      <Droppable droppableId={semester.id.toString()}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[200px] space-y-2 p-1 rounded-md ${snapshot.isDraggingOver ? 'bg-muted/60' : ''}`}
          >
            {semester.modules.map((module, idx) => (
              <Module
                key={module.id}
                module={module}
                onToggleFrozen={onToggleFrozen}
                onUpdateModule={onUpdateModule}
                onDeleteModule={onDeleteModule}
                isDragging={module.id === draggingModuleId}
                isAssigned={true}
                index={idx}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default SemesterColumn;
