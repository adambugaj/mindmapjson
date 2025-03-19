import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import DomainTable from "./dashboard/DomainTable";
import MindMapView from "./dashboard/MindMapView";
import AddDomainDialog from "./dashboard/AddDomainDialog";
import DomainTasksDialog from "./dashboard/DomainTasksDialog";
import AddInitialDomains from "./dashboard/AddInitialDomains";
import AirtableConfigDialog from "./dashboard/AirtableConfigDialog";
import {
  loadDomains,
  addDomain,
  updateDomain,
  deleteDomain,
} from "../lib/domainStorage";
import {
  fetchDomains as fetchAirtableDomains,
  createDomain as createAirtableDomain,
  updateDomain as updateAirtableDomain,
  deleteDomain as deleteAirtableDomain,
  setAirtableConfig,
} from "../lib/airtableClient";

// Define Domain type locally instead of importing it
interface Domain {
  id: string;
  name: string;
  url: string;
  da?: number;
  dr?: number;
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
  const [initialDomainsAdded, setInitialDomainsAdded] = useState(false);
  const [isAirtableConfigOpen, setIsAirtableConfigOpen] = useState(false);
  const [usingAirtable, setUsingAirtable] = useState(false);

  // Load domains and check for Airtable config on component mount
  useEffect(() => {
    const loadData = async () => {
      // Check if Airtable is configured
      const airtableConfigStr = localStorage.getItem("airtableConfig");
      if (airtableConfigStr) {
        try {
          const config = JSON.parse(airtableConfigStr);
          setAirtableConfig(config);
          setUsingAirtable(true);

          // Load domains from Airtable
          const airtableDomains = await fetchAirtableDomains();
          if (airtableDomains && airtableDomains.length > 0) {
            setDomains(airtableDomains);
            return;
          }
        } catch (error) {
          console.error("Error loading Airtable config:", error);
        }
      }

      // Fallback to localStorage if Airtable fails or isn't configured
      const storedDomains = loadDomains();
      setDomains(storedDomains);
    };

    loadData();
  }, []);

  const handleViewChange = (view: "list" | "mindmap") => {
    setCurrentView(view);
  };

  const handleAddDomain = () => {
    setSelectedDomain(null); // Clear any selected domain to ensure we're adding a new one
    setIsAddDomainOpen(true);
  };

  const handleSaveDomain = async (formData: any) => {
    const domainData = {
      name: formData.domainName,
      url: formData.url,
      da: formData.da,
      dr: formData.dr,
    };

    if (usingAirtable) {
      try {
        const newDomain = await createAirtableDomain({
          ...domainData,
          id: Math.random().toString(36).substring(2, 9),
          tasks: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        if (newDomain) {
          setDomains((prev) => [...prev, newDomain]);
        }
      } catch (error) {
        console.error("Error saving domain to Airtable:", error);
        // Fallback to localStorage
        const newDomain = addDomain(domainData);
        setDomains((prev) => [...prev, newDomain]);
      }
    } else {
      const newDomain = addDomain(domainData);
      setDomains((prev) => [...prev, newDomain]);
    }
  };

  const handleEditDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setIsAddDomainOpen(true);
  };

  const handleDeleteDomain = async (domain: Domain) => {
    if (window.confirm(`Are you sure you want to delete ${domain.name}?`)) {
      if (usingAirtable) {
        try {
          const success = await deleteAirtableDomain(domain.id);
          if (success) {
            setDomains((prev) => prev.filter((d) => d.id !== domain.id));
          }
        } catch (error) {
          console.error("Error deleting domain from Airtable:", error);
          // Fallback to localStorage
          deleteDomain(domain.id);
          setDomains((prev) => prev.filter((d) => d.id !== domain.id));
        }
      } else {
        deleteDomain(domain.id);
        setDomains((prev) => prev.filter((d) => d.id !== domain.id));
      }
    }
  };

  const handleViewTasks = (domain: Domain) => {
    // If domain has tasks property with boolean values, update it directly without opening dialog
    if (domain.tasks && typeof Object.values(domain.tasks)[0] === "boolean") {
      const updated = updateDomain(domain);
      setDomains((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d)),
      );
      return;
    }

    // Only open dialog if explicitly requested (e.g., from the tasks button)
    setSelectedDomain(domain);
    setIsTasksDialogOpen(true);
  };

  const handleSaveTasks = async (updatedDomain: any) => {
    // Convert task array to object format expected by DomainTable
    const tasksObject: Record<string, boolean> = {};
    if (Array.isArray(updatedDomain.tasks)) {
      updatedDomain.tasks.forEach((task: any) => {
        tasksObject[task.id] = task.completed;
      });
    }

    // Create updated domain with tasks in the correct format
    const domainToUpdate = {
      ...updatedDomain,
      tasks: Array.isArray(updatedDomain.tasks)
        ? tasksObject
        : updatedDomain.tasks,
    };

    if (usingAirtable) {
      try {
        const updated = await updateAirtableDomain(domainToUpdate);
        if (updated) {
          setDomains((prev) =>
            prev.map((domain) => (domain.id === updated.id ? updated : domain)),
          );
        }
      } catch (error) {
        console.error("Error updating domain in Airtable:", error);
        // Fallback to localStorage
        const updated = updateDomain(domainToUpdate);
        setDomains((prev) =>
          prev.map((domain) => (domain.id === updated.id ? updated : domain)),
        );
      }
    } else {
      const updated = updateDomain(domainToUpdate);
      setDomains((prev) =>
        prev.map((domain) => (domain.id === updated.id ? updated : domain)),
      );
    }
  };

  const handleConfigAirtable = () => {
    setIsAirtableConfigOpen(true);
  };

  const handleAirtableConfigSaved = async () => {
    setUsingAirtable(true);

    // Reload domains from Airtable
    try {
      const airtableDomains = await fetchAirtableDomains();
      if (airtableDomains && airtableDomains.length > 0) {
        setDomains(airtableDomains);
      }
    } catch (error) {
      console.error("Error fetching domains from Airtable:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!initialDomainsAdded && domains.length === 0 && (
        <AddInitialDomains
          onComplete={() => {
            setInitialDomainsAdded(true);
            setDomains(loadDomains());
          }}
        />
      )}

      <DashboardHeader
        onAddDomain={handleAddDomain}
        onViewChange={handleViewChange}
        onConfigAirtable={handleConfigAirtable}
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

      <AirtableConfigDialog
        open={isAirtableConfigOpen}
        onOpenChange={setIsAirtableConfigOpen}
        onConfigSaved={handleAirtableConfigSaved}
      />
    </div>
  );
};

export default Home;
