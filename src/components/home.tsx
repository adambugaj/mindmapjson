import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import DomainTable from "./dashboard/DomainTable";
import MindMapView from "./dashboard/MindMapView";
import AddDomainDialog from "./dashboard/AddDomainDialog";
import DomainTasksDialog from "./dashboard/DomainTasksDialog";
import {
  loadDomains,
  addDomain,
  updateDomain,
  deleteDomain,
} from "../lib/domainStorage";

// Define Domain type locally instead of importing it
interface Domain {
  id: string;
  name: string;
  url: string;
  progress?: number;
  tasks?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

const Home = () => {
  const [currentView, setCurrentView] = useState<"list" | "mindmap">("list");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);

  // Load domains on component mount
  useEffect(() => {
    const storedDomains = loadDomains();
    setDomains(storedDomains);
  }, []);

  const handleViewChange = (view: "list" | "mindmap") => {
    setCurrentView(view);
  };

  const handleAddDomain = () => {
    setIsAddDomainOpen(true);
  };

  const handleSaveDomain = (formData: any) => {
    const newDomain = addDomain({
      name: formData.domainName,
      url: formData.url,
    });

    setDomains((prev) => [...prev, newDomain]);
  };

  const handleEditDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setIsAddDomainOpen(true);
  };

  const handleDeleteDomain = (domain: Domain) => {
    if (window.confirm(`Are you sure you want to delete ${domain.name}?`)) {
      deleteDomain(domain.id);
      setDomains((prev) => prev.filter((d) => d.id !== domain.id));
    }
  };

  const handleViewTasks = (domain: Domain) => {
    setSelectedDomain(domain);
    setIsTasksDialogOpen(true);
  };

  const handleSaveTasks = (updatedDomain: any) => {
    const updated = updateDomain(updatedDomain);
    setDomains((prev) =>
      prev.map((domain) => (domain.id === updated.id ? updated : domain)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onAddDomain={handleAddDomain}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      <main className="container mx-auto py-6 px-4">
        {currentView === "list" ? (
          <DomainTable
            domains={domains}
            onEdit={handleEditDomain}
            onDelete={handleDeleteDomain}
            onViewTasks={handleViewTasks}
          />
        ) : (
          <MindMapView domains={domains} onDomainSelect={handleViewTasks} />
        )}
      </main>

      <AddDomainDialog
        open={isAddDomainOpen}
        onOpenChange={setIsAddDomainOpen}
        onSave={handleSaveDomain}
      />

      {selectedDomain && (
        <DomainTasksDialog
          domain={{
            ...selectedDomain,
            tasks: selectedDomain.tasks
              ? Object.entries(selectedDomain.tasks).map(([id, completed]) => ({
                  id,
                  name:
                    id.charAt(0).toUpperCase() +
                    id.slice(1).replace(/([A-Z])/g, " $1"),
                  completed: completed as boolean,
                }))
              : [],
          }}
          open={isTasksDialogOpen}
          onOpenChange={setIsTasksDialogOpen}
          onSave={handleSaveTasks}
        />
      )}
    </div>
  );
};

export default Home;
