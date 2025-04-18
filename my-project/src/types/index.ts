
// Module types
export type SemesterType = "Winter" | "Summer";

export interface Module {
  id: string;
  name: string;
  offering: SemesterType[];
  hardness: 1 | 2 | 3;
  credits: number;
  frozen?: boolean;
  semesterId?: number | null;
}

// Semester types
export interface Semester {
  id: number;
  name: string;
  type: SemesterType;
  hardnessLimit: number;
  modules: Module[];
}

// Plan types
export interface Plan {
  id: string;
  name: string;
  semesters: Semester[];
  score: number;
}

// Context and state types
export interface StudyPlannerState {
  modules: Module[];
  semesters: Semester[];
  firstSemesterType: SemesterType;
  currentPlan: Plan | null;
  alternativePlans: Plan[];
  apiKey: string;
}

export interface DragItem {
  type: string;
  id: string;
  originalSemesterId?: number | null;
}
