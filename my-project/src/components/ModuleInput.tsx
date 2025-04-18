import React, { useState } from "react";
import { Module, SemesterType } from "../types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";

interface ModuleInputProps {
  onAddModule: (module: Module) => void;
}

const ModuleInput: React.FC<ModuleInputProps> = ({ onAddModule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [offerWinter, setOfferWinter] = useState(false);
  const [offerSummer, setOfferSummer] = useState(false);
  const [hardness, setHardness] = useState<1 | 2 | 3>(1);
  const [credits, setCredits] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a module name");
      return;
    }

    if (!offerWinter && !offerSummer) {
      toast.error("Module must be offered in at least one semester");
      return;
    }

    const offering: SemesterType[] = [];
    if (offerWinter) offering.push("Winter");
    if (offerSummer) offering.push("Summer");

    const newModule: Module = {
      id: uuidv4(),
      name: name.trim(),
      offering,
      hardness: hardness,
      credits,
      frozen: false,
      semesterId: null
    };

    onAddModule(newModule);
    toast.success(`Module "${name}" added`);

    setName("");
    setOfferWinter(false);
    setOfferSummer(false);
    setHardness(1);
    setCredits(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="module-form" className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mathematics 101"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>Offered In</Label>
              <div className="flex space-x-4 items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="winter"
                    checked={offerWinter}
                    onCheckedChange={() => setOfferWinter(!offerWinter)}
                  />
                  <Label htmlFor="winter">Winter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="summer"
                    checked={offerSummer}
                    onCheckedChange={() => setOfferSummer(!offerSummer)}
                  />
                  <Label htmlFor="summer">Summer</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="hardness">Hardness</Label>
              <div className="flex space-x-4">
                {[1, 2, 3].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`hardness-${level}`}
                      name="hardness"
                      checked={hardness === level}
                      onChange={() => setHardness(level as 1 | 2 | 3)}
                      className="text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`hardness-${level}`}>{level}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="credits">Credit Points</Label>
              <Input
                id="credits"
                type="number"
                min={1}
                max={30}
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value))}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="module-form" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Add Module
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleInput;
