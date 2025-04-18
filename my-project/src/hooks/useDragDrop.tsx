
import { useState } from "react";
import { Module, Semester } from "../types";
import { toast } from "sonner";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface UseDragDropProps {
  semesters: Semester[];
  onUpdateSemesters: (semesters: Semester[]) => void;
  unassignedModules: Module[];
  setUnassignedModules: (modules: Module[]) => void;
}

export const useDragDrop = ({ 
  semesters, 
  onUpdateSemesters, 
  unassignedModules, 
  setUnassignedModules 
}: UseDragDropProps) => {
  const [draggingModuleId, setDraggingModuleId] = useState<string | null>(null);

  const handleDragStart = (result: any) => {
    const { draggableId } = result;
    setDraggingModuleId(draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    setDraggingModuleId(null);
    
    // If dropped outside of a droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Find the module that is being dragged
    let moduleToMove: Module | undefined;
    
    // Check if the module is from unassigned area
    if (source.droppableId === "unassigned") {
      moduleToMove = {...unassignedModules[source.index]};
    } else {
      // Find module in a semester
      const semesterId = parseInt(source.droppableId);
      const sourceSemester = semesters.find(s => s.id === semesterId);
      if (sourceSemester) {
        moduleToMove = {...sourceSemester.modules[source.index]};
      }
    }

    if (!moduleToMove) return;

    // Check if module is frozen and already in a semester, if so prevent moving
    if (moduleToMove.frozen && moduleToMove.semesterId !== null && source.droppableId !== "unassigned") {
      toast.error("Cannot move a frozen module");
      return;
    }

    // If moving to a semester, check constraints
    if (destination.droppableId !== "unassigned") {
      const targetSemesterId = parseInt(destination.droppableId);
      const targetSemester = semesters.find(s => s.id === targetSemesterId);
      
      if (!targetSemester) return;

      // Check semester type constraint
      if (!moduleToMove.offering.includes(targetSemester.type)) {
        toast.error(`Module ${moduleToMove.name} is not offered in ${targetSemester.type} semester`);
        return;
      }

      // Calculate new hardness sum (excluding the module itself if it's already in this semester)
      const currentModules = targetSemester.modules.filter(m => 
        !(source.droppableId === destination.droppableId && m.id === moduleToMove?.id)
      );
      const currentHardnessSum = currentModules.reduce(
        (sum, module) => sum + module.hardness, 
        0
      );
      const newHardnessSum = currentHardnessSum + moduleToMove.hardness;

      // Check hardness limit
      if (newHardnessSum > targetSemester.hardnessLimit) {
        toast.error(`Adding this module would exceed the hardness limit for ${targetSemester.name}`);
        return;
      }
    }

    // IMPORTANT FIX: First, remove the module from ALL possible locations
    // 1. Remove from unassigned modules if it exists there
    const newUnassigned = unassignedModules.filter(m => m.id !== moduleToMove!.id);
    
    // 2. Remove from any semester it might be in
    const updatedSemesters = semesters.map(semester => ({
      ...semester,
      modules: semester.modules.filter(m => m.id !== moduleToMove!.id)
    }));
    
    // Now add to destination
    if (destination.droppableId === "unassigned") {
      // Update the module to remove semester assignment
      const updatedModule = {
        ...moduleToMove!,
        semesterId: null
      };
      
      // Insert at the right position
      newUnassigned.splice(destination.index, 0, updatedModule);
    } else {
      const semesterId = parseInt(destination.droppableId);
      const updatedModule = {
        ...moduleToMove!,
        semesterId: semesterId
      };
      
      // Add to the target semester at the right position
      const targetSemesterIndex = updatedSemesters.findIndex(s => s.id === semesterId);
      if (targetSemesterIndex !== -1) {
        updatedSemesters[targetSemesterIndex].modules.splice(destination.index, 0, updatedModule);
      }
    }

    // Update state with the new arrangements
    setUnassignedModules(newUnassigned);
    onUpdateSemesters(updatedSemesters);
  };

  return {
    draggingModuleId,
    handleDragStart,
    handleDragEnd,
    DragDropContext
  };
};
