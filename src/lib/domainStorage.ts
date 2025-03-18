// Domain data types
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
}

export interface Domain {
  id: string;
  name: string;
  url: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

// Default tasks for new domains
export const DEFAULT_TASKS: Omit<Task, "id">[] = [
  { name: "Installation", completed: false },
  { name: "Configuration", completed: false },
  { name: "GSC/CF Setup", completed: false },
  { name: "Content", completed: false },
  { name: "WWW Status", completed: false },
  { name: "UX/WH Publishing", completed: false },
  { name: "Traffic", completed: false },
  { name: "Monetization", completed: false },
];

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calculate progress percentage for a domain
export const calculateProgress = (domain: Domain): number => {
  if (!domain.tasks.length) return 0;
  const completedTasks = domain.tasks.filter((task) => task.completed).length;
  return Math.round((completedTasks / domain.tasks.length) * 100);
};

// Load domains from localStorage
export const loadDomains = (): Domain[] => {
  try {
    const domainsJson = localStorage.getItem("domains");
    return domainsJson ? JSON.parse(domainsJson) : [];
  } catch (error) {
    console.error("Error loading domains:", error);
    return [];
  }
};

// Save domains to localStorage
export const saveDomains = (domains: Domain[]): void => {
  try {
    localStorage.setItem("domains", JSON.stringify(domains));
  } catch (error) {
    console.error("Error saving domains:", error);
  }
};

// Add a new domain
export const addDomain = (
  domainData: Omit<Domain, "id" | "tasks" | "createdAt" | "updatedAt">,
): Domain => {
  const domains = loadDomains();

  const newDomain: Domain = {
    id: generateId(),
    ...domainData,
    tasks: DEFAULT_TASKS.map((task) => ({ ...task, id: generateId() })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  domains.push(newDomain);
  saveDomains(domains);

  return newDomain;
};

// Update an existing domain
export const updateDomain = (updatedDomain: Domain): Domain => {
  const domains = loadDomains();
  const index = domains.findIndex((d) => d.id === updatedDomain.id);

  if (index !== -1) {
    domains[index] = {
      ...updatedDomain,
      updatedAt: new Date().toISOString(),
    };
    saveDomains(domains);
  }

  return domains[index];
};

// Delete a domain
export const deleteDomain = (id: string): void => {
  const domains = loadDomains();
  const updatedDomains = domains.filter((domain) => domain.id !== id);
  saveDomains(updatedDomains);
};

// Update a task within a domain
export const updateTask = (
  domainId: string,
  taskId: string,
  updates: Partial<Task>,
): Domain | null => {
  const domains = loadDomains();
  const domainIndex = domains.findIndex((d) => d.id === domainId);

  if (domainIndex === -1) return null;

  const domain = domains[domainIndex];
  const taskIndex = domain.tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) return null;

  domain.tasks[taskIndex] = {
    ...domain.tasks[taskIndex],
    ...updates,
  };

  domain.updatedAt = new Date().toISOString();
  domains[domainIndex] = domain;
  saveDomains(domains);

  return domain;
};

// Export a JSON file with all domains
export const exportDomainsToJson = (): string => {
  const domains = loadDomains();
  return JSON.stringify(domains, null, 2);
};

// Import domains from a JSON file
export const importDomainsFromJson = (jsonString: string): boolean => {
  try {
    const domains = JSON.parse(jsonString);
    if (!Array.isArray(domains)) {
      throw new Error("Invalid format: expected an array of domains");
    }
    saveDomains(domains);
    return true;
  } catch (error) {
    console.error("Error importing domains:", error);
    return false;
  }
};
