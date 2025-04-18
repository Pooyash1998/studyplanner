import React, { useState } from "react";
import { Module, SemesterType } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ModuleEditDialogProps {
  module: Module;
  onUpdate: (updatedModule: Module) => void;
  onDelete: (moduleId: string) => void;
}

const ModuleEditDialog: React.FC<ModuleEditDialogProps> = ({
  module,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState(module.name);
  const [credits, setCredits] = useState(module.credits);
  const [hardness, setHardness] = useState<1 | 2 | 3>(module.hardness);
  const [offering, setOffering] = useState<SemesterType[]>(module.offering);

  const handleSubmit = () => {
    onUpdate({
      ...module,
      name,
      credits,
      hardness,
      offering,
    });
  };

  // Helper function to safely set the hardness value
  const setHardnessValue = (value: number) => {
    if (value === 1 || value === 2 || value === 3) {
      setHardness(value as 1 | 2 | 3);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full cursor-pointer">
          {/* This div wraps the entire module content */}
          {module.name}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Edit Module
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Module</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this module? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(module.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hardness">Hardness (1-3)</Label>
            <Input
              id="hardness"
              type="number"
              min={1}
              max={3}
              value={hardness}
              onChange={(e) => setHardnessValue(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Offered in</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="winter"
                  checked={offering.includes("Winter")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setOffering([...offering, "Winter"]);
                    } else {
                      setOffering(offering.filter((sem) => sem !== "Winter"));
                    }
                  }}
                />
                <Label htmlFor="winter">Winter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summer"
                  checked={offering.includes("Summer")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setOffering([...offering, "Summer"]);
                    } else {
                      setOffering(offering.filter((sem) => sem !== "Summer"));
                    }
                  }}
                />
                <Label htmlFor="summer">Summer</Label>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full">Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleEditDialog;
