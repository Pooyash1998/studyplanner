import React, { useState, useEffect } from "react";
import { Module, Semester, SemesterType, Plan } from "../types";
import { useDragDrop } from "../hooks/useDragDrop";
import SemesterColumn from "./SemesterColumn";
import ModuleInput from "./ModuleInput";
import OptimalPlanSection from "./OptimalPlanSection";
import UnassignedModules from "./UnassignedModules";
import SettingsDialog from "./SettingsDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { v4 as uuidv4 } from "uuid";

const SemesterPlanner: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [firstSemesterType, setFirstSemesterType] = useState<SemesterType>("Winter");
  const [hardnessLimits, setHardnessLimits] = useState<number[]>([5, 5, 5, 5]);
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [alternativePlans, setAlternativePlans] = useState<Plan[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const unassignedModules = modules.filter(module => 
    !semesters.some(semester => 
      semester.modules.some(m => m.id === module.id)
    )
  );
  const [unassignedModulesState, setUnassignedModulesState] = useState<Module[]>(unassignedModules);

  useEffect(() => {
    const semesterTypes: SemesterType[] = [];
    for (let i = 0; i < 4; i++) {
      if (firstSemesterType === "Winter") {
        semesterTypes.push(i % 2 === 0 ? "Winter" : "Summer");
      } else {
        semesterTypes.push(i % 2 === 0 ? "Summer" : "Winter");
      }
    }

    const newSemesters: Semester[] = semesterTypes.map((type, index) => ({
      id: index + 1,
      name: `Semester ${index + 1}`,
      type,
      hardnessLimit: hardnessLimits[index],
      modules: []
    }));

    setSemesters(newSemesters);
  }, [firstSemesterType, hardnessLimits]);

  useEffect(() => {
    const savedModules = localStorage.getItem("studywise-modules");
    if (savedModules) {
      try {
        setModules(JSON.parse(savedModules));
      } catch (error) {
        console.error("Error loading modules:", error);
      }
    }

    const savedSemesters = localStorage.getItem("studywise-semesters");
    if (savedSemesters) {
      try {
        setSemesters(JSON.parse(savedSemesters));
      } catch (error) {
        console.error("Error loading semesters:", error);
      }
    }

    const savedFirstSemesterType = localStorage.getItem("studywise-first-semester-type");
    if (savedFirstSemesterType) {
      setFirstSemesterType(savedFirstSemesterType as SemesterType);
    }

    const savedHardnessLimits = localStorage.getItem("studywise-hardness-limits");
    if (savedHardnessLimits) {
      try {
        setHardnessLimits(JSON.parse(savedHardnessLimits));
      } catch (error) {
        console.error("Error loading hardness limits:", error);
      }
    }

    const savedApiKey = localStorage.getItem("studywise-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    const savedCurrentPlan = localStorage.getItem("studywise-current-plan");
    if (savedCurrentPlan) {
      try {
        setCurrentPlan(JSON.parse(savedCurrentPlan));
      } catch (error) {
        console.error("Error loading current plan:", error);
      }
    }

    const savedAlternativePlans = localStorage.getItem("studywise-alternative-plans");
    if (savedAlternativePlans) {
      try {
        setAlternativePlans(JSON.parse(savedAlternativePlans));
      } catch (error) {
        console.error("Error loading alternative plans:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studywise-modules", JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem("studywise-semesters", JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem("studywise-first-semester-type", firstSemesterType);
  }, [firstSemesterType]);

  useEffect(() => {
    localStorage.setItem("studywise-hardness-limits", JSON.stringify(hardnessLimits));
  }, [hardnessLimits]);

  useEffect(() => {
    localStorage.setItem("studywise-api-key", apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem("studywise-current-plan", JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem("studywise-alternative-plans", JSON.stringify(alternativePlans));
  }, [alternativePlans]);

  useEffect(() => {
    setUnassignedModulesState(modules.filter(module => 
      !semesters.some(semester => 
        semester.modules.some(m => m.id === module.id)
      )
    ));
  }, [modules, semesters]);

  const { draggingModuleId, handleDragStart, handleDragEnd, DragDropContext } = useDragDrop({
    semesters,
    onUpdateSemesters: setSemesters,
    unassignedModules: unassignedModulesState,
    setUnassignedModules: setUnassignedModulesState
  });

  const handleAddModule = (module: Module) => {
    setModules([...modules, module]);
  };

  const handleToggleFrozen = (moduleId: string) => {
    const updatedSemesters = semesters.map(semester => {
      const moduleIndex = semester.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        const updatedModules = [...semester.modules];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          frozen: !updatedModules[moduleIndex].frozen
        };
        return { ...semester, modules: updatedModules };
      }
      return semester;
    });

    setSemesters(updatedSemesters);
  };

  const handleUpdateHardnessLimit = (index: number, value: string) => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue > 0) {
      const newHardnessLimits = [...hardnessLimits];
      newHardnessLimits[index] = newValue;
      setHardnessLimits(newHardnessLimits);

      const updatedSemesters = semesters.map((semester, idx) => {
        if (idx === index) {
          return { ...semester, hardnessLimit: newValue };
        }
        return semester;
      });

      setSemesters(updatedSemesters);
    }
  };

  const handleResetAssignments = () => {
    const resetSemesters = semesters.map(semester => ({
      ...semester,
      modules: []
    }));

    setSemesters(resetSemesters);
    setCurrentPlan(null);
    setAlternativePlans([]);
    toast.success("All module assignments have been reset");
  };

  const prepareDataForAI = () => {
    const unassignedModulesData = unassignedModulesState.map(module => ({
      id: module.id,
      name: module.name,
      offering: module.offering,
      hardness: module.hardness,
      credits: module.credits
    }));

    const frozenModulesData = semesters.flatMap(semester => 
      semester.modules
        .filter(module => module.frozen)
        .map(module => ({
          id: module.id,
          name: module.name,
          semesterId: semester.id,
          offering: module.offering,
          hardness: module.hardness,
          credits: module.credits
        }))
    );

    const semestersData = semesters.map(semester => ({
      id: semester.id,
      name: semester.name,
      type: semester.type,
      hardnessLimit: semester.hardnessLimit
    }));

    return {
      unassignedModules: unassignedModulesData,
      frozenModules: frozenModulesData,
      semesters: semestersData
    };
  };

  const parseAIResponse = (response: any): Plan[] => {
    try {
      const plans = response.plans.map((plan: any) => {
        const planSemesters = semesters.map(semester => ({
          ...semester,
          modules: []
        }));

        semesters.forEach(semester => {
          semester.modules
            .filter(module => module.frozen)
            .forEach(frozenModule => {
              const semesterIdx = planSemesters.findIndex(s => s.id === semester.id);
              if (semesterIdx >= 0) {
                planSemesters[semesterIdx].modules.push({...frozenModule});
              }
            });
        });

        plan.assignments.forEach((assignment: any) => {
          const moduleToAssign = modules.find(m => m.id === assignment.moduleId);
          if (moduleToAssign && assignment.semesterId) {
            const semesterIdx = planSemesters.findIndex(s => s.id === assignment.semesterId);
            if (semesterIdx >= 0) {
              planSemesters[semesterIdx].modules.push({
                ...moduleToAssign,
                semesterId: assignment.semesterId
              });
            }
          }
        });

        return {
          id: uuidv4(),
          name: plan.name,
          semesters: planSemesters,
          score: plan.score
        };
      });

      return plans;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse AI response");
    }
  };

  const generatePrompt = (data: any): string => {
    return `
You are an AI academic advisor tasked with creating an optimal study plan for a student.

Here is the student's situation:

1. Unassigned Modules: ${JSON.stringify(data.unassignedModules)}
2. Frozen Modules (already assigned and cannot be moved): ${JSON.stringify(data.frozenModules)}
3. Semester Information: ${JSON.stringify(data.semesters)}

Requirements for a good study plan:
- Each module must be assigned to a semester when it is offered (see module.offering)
- The sum of module hardness in each semester should not exceed the hardness limit for that semester
- Distribute workload as evenly as possible across semesters
- More credits in earlier semesters is generally better
- Ensure prerequisite modules (if any) are taken before their dependent modules

Please generate a main optimal plan and 2-3 alternative plans.
Give each plan a descriptive name and a score from 0-100 indicating how good the plan is.

Your response must be in the following JSON format:
{
  "plans": [
    {
      "name": "Plan Name",
      "description": "Short description of the plan strategy",
      "assignments": [
        { "moduleId": "id1", "semesterId": 1 },
        { "moduleId": "id2", "semesterId": 2 }
      ],
      "score": 95
    },
    ...more alternative plans...
  ]
}
`;
  };

  const handleGeneratePlan = async () => {
    if (!apiKey) {
      toast.error("Please set your API key first");
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsGeneratingPlan(true);

    try {
      const data = prepareDataForAI();
      const prompt = generatePrompt(data);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an academic advisor AI that creates optimal study plans."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      
      const aiResponseContent = result.choices[0].message.content;
      
      const jsonMatch = aiResponseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not extract valid JSON from the AI response");
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      const plans = parseAIResponse(parsedResponse);
      
      if (plans.length > 0) {
        setCurrentPlan(plans[0]);
        setSemesters(plans[0].semesters);
        
        setAlternativePlans(plans.slice(1));
        
        toast.success("Optimal study plan generated!");
      } else {
        throw new Error("No valid plans generated");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error(`Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setSemesters(plan.semesters);
    toast.success(`Applied plan: ${plan.name}`);
  };

  const handleUpdateModule = (updatedModule: Module) => {
    const newModules = modules.map(m => 
      m.id === updatedModule.id ? updatedModule : m
    );
    setModules(newModules);
    toast.success("Module updated successfully", {
      duration: 2000
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
    setSemesters(semesters.map(semester => ({
      ...semester,
      modules: semester.modules.filter(m => m.id !== moduleId)
    })));
    toast.success("Module deleted successfully", {
      duration: 2000
    });
  };

  const handleExport = async (format: 'pdf' | 'png' | 'md') => {
    const element = document.querySelector('.semester-planner-content');
    if (!element) return;

    try {
      switch (format) {
        case 'pdf':
          const canvas = await html2canvas(element as HTMLElement);
          const pdf = new jsPDF('l', 'mm', 'a4');
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210);
          pdf.save('study-plan.pdf');
          break;

        case 'png':
          const pngCanvas = await html2canvas(element as HTMLElement);
          const link = document.createElement('a');
          link.download = 'study-plan.png';
          link.href = pngCanvas.toDataURL('image/png');
          link.click();
          break;

        case 'md':
          let markdown = '# Study Plan\n\n';
          semesters.forEach(semester => {
            markdown += `## ${semester.name} (${semester.type})\n\n`;
            semester.modules.forEach(module => {
              markdown += `- ${module.name} (${module.credits} CP, Hardness: ${module.hardness})\n`;
            });
            markdown += '\n';
          });
          const blob = new Blob([markdown], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const mdLink = document.createElement('a');
          mdLink.href = url;
          mdLink.download = 'study-plan.md';
          mdLink.click();
          break;
      }
      toast.success(`Saved as ${format.toUpperCase()}`, {
        duration: 2000
      });
    } catch (error) {
      toast.error(`Failed to save as ${format.toUpperCase()}`, {
        duration: 2000
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">StudyWise Planner</h1>
        <div className="flex items-center gap-2">
          <ModuleInput onAddModule={handleAddModule} />
          <SettingsDialog
            apiKey={apiKey}
            onSaveApiKey={setApiKey}
            firstSemesterType={firstSemesterType}
            onFirstSemesterTypeChange={(type) => setFirstSemesterType(type as SemesterType)}
            hardnessLimits={hardnessLimits}
            onHardnessLimitChange={handleUpdateHardnessLimit}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAssignments}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Assignments
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="space-y-8 semester-planner-content">
          <UnassignedModules
            modules={unassignedModulesState}
            onToggleFrozen={handleToggleFrozen}
            onUpdateModule={handleUpdateModule}
            onDeleteModule={handleDeleteModule}
            draggingModuleId={draggingModuleId}
          />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Semester Plan</h2>
            <div className="grid grid-cols-4 gap-2">
              {semesters.map((semester, index) => (
                <div key={semester.id} className="border rounded-lg p-3 bg-card">
                  <SemesterColumn
                    semester={semester}
                    index={index}
                    onToggleFrozen={handleToggleFrozen}
                    onUpdateModule={handleUpdateModule}
                    onDeleteModule={handleDeleteModule}
                    draggingModuleId={draggingModuleId}
                  />
                </div>
              ))}
            </div>

            <OptimalPlanSection
              currentPlan={currentPlan}
              alternativePlans={alternativePlans}
              onSelectPlan={handleSelectPlan}
              isGenerating={isGeneratingPlan}
              onGeneratePlan={handleGeneratePlan}
              apiKey={apiKey}
              onExport={handleExport}
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default SemesterPlanner;
