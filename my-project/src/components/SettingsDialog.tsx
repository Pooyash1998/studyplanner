
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import { SemesterType } from "../types";

interface SettingsDialogProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  firstSemesterType: SemesterType;
  onFirstSemesterTypeChange: (type: SemesterType) => void;
  hardnessLimits: number[];
  onHardnessLimitChange: (index: number, value: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  apiKey,
  onSaveApiKey,
  firstSemesterType,
  onFirstSemesterTypeChange,
  hardnessLimits,
  onHardnessLimitChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputKey, setInputKey] = React.useState(apiKey);

  const handleSaveAndClose = () => {
    onSaveApiKey(inputKey.trim());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* API Key Settings */}
          <div className="space-y-2">
            <h3 className="text-md font-medium">API Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="apiKey">AI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          </div>

          {/* Semester Settings */}
          <div className="space-y-2">
            <h3 className="text-md font-medium">Semester Settings</h3>
            <div className="space-y-2">
              <Label>First Semester Type</Label>
              <RadioGroup
                value={firstSemesterType}
                onValueChange={(value) => onFirstSemesterTypeChange(value as SemesterType)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Winter" id="winter-first" />
                  <Label htmlFor="winter-first">Winter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Summer" id="summer-first" />
                  <Label htmlFor="summer-first">Summer</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Hardness Limits - More compact layout */}
          <div className="space-y-2">
            <h3 className="text-md font-medium">Hardness Limits per Semester</h3>
            <div className="grid grid-cols-4 gap-3">
              {hardnessLimits.map((limit, index) => (
                <div key={`hardness-limit-${index}`} className="space-y-1">
                  <Label htmlFor={`hardness-limit-${index + 1}`} className="text-xs">
                    Sem {index + 1}
                  </Label>
                  <Input
                    id={`hardness-limit-${index + 1}`}
                    type="number"
                    min={1}
                    value={limit}
                    onChange={(e) => onHardnessLimitChange(index, e.target.value)}
                    className="h-8"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveAndClose}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
