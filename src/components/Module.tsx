
import React from "react";
import { Module as ModuleType } from "../types";
import { Snowflake, Sun, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Draggable } from "@hello-pangea/dnd";
import ModuleEditDialog from "./ModuleEditDialog";

interface ModuleProps {
  module: ModuleType;
  onToggleFrozen: (moduleId: string) => void;
  onUpdateModule: (updatedModule: ModuleType) => void;
  onDeleteModule: (moduleId: string) => void;
  isDragging: boolean;
  isAssigned: boolean;
  index: number;
}

const Module: React.FC<ModuleProps> = ({
  module,
  onToggleFrozen,
  onUpdateModule,
  onDeleteModule,
  isDragging,
  isAssigned,
  index
}) => {
  return (
    <Draggable 
      draggableId={module.id} 
      index={index}
      isDragDisabled={module.frozen && isAssigned}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`module-card ${module.frozen ? "frozen" : ""} ${snapshot.isDragging ? "dragging" : ""}`}
          id={`module-${module.id}`}
        >
          <div className="flex justify-between items-start mb-2">
            <ModuleEditDialog
              module={module}
              onUpdate={onUpdateModule}
              onDelete={onDeleteModule}
            />
            {isAssigned && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => onToggleFrozen(module.id)}
                title={module.frozen ? "Unfreeze module" : "Freeze module"}
              >
                {module.frozen ? (
                  <Lock className="h-4 w-4 text-primary" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex space-x-2">
              <div className="flex items-center">
                <span className="mr-1">Offered in:</span>
                {module.offering.includes("Winter") && (
                  <Snowflake className="h-3 w-3 text-blue-500 mr-1" />
                )}
                {module.offering.includes("Summer") && (
                  <Sun className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hardness-indicator" title={`Hardness: ${module.hardness}`}>
                {[1, 2, 3].map(level => (
                  <div
                    key={level}
                    className={`hardness-dot ${level <= module.hardness ? "active" : ""}`}
                  />
                ))}
              </div>
              <span>{module.credits} CP</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Module;
