import React, { useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { PlusCircle, List, Network } from "lucide-react";

interface DashboardHeaderProps {
  onAddDomain?: () => void;
  onViewChange?: (view: "list" | "mindmap") => void;
  currentView?: "list" | "mindmap";
  title?: string;
}

const DashboardHeader = ({
  onAddDomain = () => {},
  onViewChange = () => {},
  currentView = "list",
  title = "PBN Domain Management",
}: DashboardHeaderProps) => {
  const [view, setView] = useState<"list" | "mindmap">(currentView);

  const handleViewChange = (newView: "list" | "mindmap") => {
    setView(newView);
    onViewChange(newView);
  };

  return (
    <header className="w-full h-20 px-6 bg-background border-b flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Tabs
          defaultValue={view}
          onValueChange={(value) =>
            handleViewChange(value as "list" | "mindmap")
          }
        >
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Mind Map
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          onClick={onAddDomain}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          Add Domain
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
