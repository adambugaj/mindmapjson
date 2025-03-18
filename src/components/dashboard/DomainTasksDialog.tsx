import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface Domain {
  id: string;
  name: string;
  url: string;
  tasks: Task[];
  notes?: string;
}

interface DomainTasksDialogProps {
  domain?: Domain;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (domain: Domain) => void;
}

const defaultTasks: Task[] = [
  { id: "installation", name: "Installation", completed: false },
  { id: "configuration", name: "Configuration", completed: false },
  { id: "gsc-cf", name: "GSC/CF Setup", completed: false },
  { id: "content", name: "Content", completed: false },
  { id: "www-status", name: "WWW Status", completed: false },
  { id: "ux-wh", name: "UX/WH Publishing", completed: false },
  { id: "traffic", name: "Traffic", completed: false },
  { id: "monetization", name: "Monetization", completed: false },
];

const defaultDomain: Domain = {
  id: "default-domain",
  name: "example.com",
  url: "https://example.com",
  tasks: defaultTasks,
  notes: "",
};

const DomainTasksDialog: React.FC<DomainTasksDialogProps> = ({
  domain = defaultDomain,
  open = true,
  onOpenChange,
  onSave,
}) => {
  const [localDomain, setLocalDomain] = useState<Domain>(domain);

  const handleTaskToggle = (taskId: string) => {
    setLocalDomain((prev) => {
      const updatedTasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      );
      return { ...prev, tasks: updatedTasks };
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDomain((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localDomain);
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Calculate completion percentage
  const completedTasks = localDomain.tasks.filter(
    (task) => task.completed,
  ).length;
  const totalTasks = localDomain.tasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Domain Tasks: {localDomain.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Progress</h3>
            <div className="flex items-center gap-2">
              <div className="w-40">
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <span className="text-sm font-medium">
                {completionPercentage}% Complete
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {localDomain.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50"
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  className="mt-1"
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <Textarea
              value={localDomain.notes || ""}
              onChange={handleNotesChange}
              placeholder="Add notes about this domain..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DomainTasksDialog;
