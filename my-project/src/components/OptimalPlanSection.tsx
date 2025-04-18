import React from "react";
import { Plan } from "../types";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface OptimalPlanSectionProps {
  currentPlan: Plan | null;
  alternativePlans: Plan[];
  onSelectPlan: (plan: Plan) => void;
  isGenerating: boolean;
  onGeneratePlan: () => void;
  apiKey: string;
  onExport: (format: 'pdf' | 'png' | 'md') => void;
}

const OptimalPlanSection: React.FC<OptimalPlanSectionProps> = ({
  currentPlan,
  alternativePlans,
  onSelectPlan,
  isGenerating,
  onGeneratePlan,
  apiKey,
  onExport
}) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Study Plans</span>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Save As
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => onExport('pdf')}>PDF</Button>
                  <Button variant="ghost" onClick={() => onExport('png')}>PNG</Button>
                  <Button variant="ghost" onClick={() => onExport('md')}>Markdown</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              onClick={onGeneratePlan}
              disabled={isGenerating || !apiKey}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Plans
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!apiKey && (
          <p className="text-sm text-yellow-600 mb-4">
            Please set your AI API key in settings to generate optimal plans.
          </p>
        )}

        {currentPlan && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Optimal Plan</h3>
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{currentPlan.name}</h4>
                <span className="text-xs text-gray-500">Score: {currentPlan.score}</span>
              </div>
              <Button variant="default" className="w-full">Current Plan</Button>
            </div>
          </div>
        )}

        {alternativePlans.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Alternative Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {alternativePlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="border rounded-md p-3 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => onSelectPlan(plan)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Alternative Plan {index + 1}</h4>
                    <span className="text-xs text-gray-500">Score: {plan.score}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Apply This Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimalPlanSection;
