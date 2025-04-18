
import React from "react";
import { Module as ModuleType } from "../types";
import ModuleComponent from "./Module";
import { Droppable } from "@hello-pangea/dnd";

interface UnassignedModulesProps {
  modules: ModuleType[];
  onToggleFrozen: (moduleId: string) => void;
  onUpdateModule: (updatedModule: ModuleType) => void;
  onDeleteModule: (moduleId: string) => void;
  draggingModuleId: string | null;
}

const UnassignedModules: React.FC<UnassignedModulesProps> = ({
  modules,
  onToggleFrozen,
  onUpdateModule,
  onDeleteModule,
  draggingModuleId
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        Unassigned Modules
        <span className="text-sm font-normal text-muted-foreground">
          ({modules.length})
        </span>
      </h2>
      <div className="border rounded-lg p-4 bg-card min-h-[100px]">
        <Droppable droppableId="unassigned" direction="horizontal">
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] ${snapshot.isDraggingOver ? 'bg-muted/30' : ''}`}
            >
              {modules.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center col-span-full">No unassigned modules</p>
              ) : (
                modules.map((module, index) => (
                  <ModuleComponent
                    key={module.id}
                    module={module}
                    onToggleFrozen={onToggleFrozen}
                    onUpdateModule={onUpdateModule}
                    onDeleteModule={onDeleteModule}
                    isDragging={module.id === draggingModuleId}
                    isAssigned={false}
                    index={index}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default UnassignedModules;
