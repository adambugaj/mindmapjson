// Airtable API client for domain management

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

let config: AirtableConfig = {
  apiKey: "", // Will be set by setAirtableConfig
  baseId: "", // Will be set by setAirtableConfig
  tableName: "Domains", // Default table name
};

export const setAirtableConfig = (newConfig: Partial<AirtableConfig>) => {
  config = { ...config, ...newConfig };
};

// Convert domain object to Airtable record format
const domainToAirtableRecord = (domain: any) => {
  // Convert tasks object to a string for storage
  const tasksString = JSON.stringify(domain.tasks);

  return {
    fields: {
      id: domain.id,
      name: domain.name,
      url: domain.url,
      da: domain.da || 0,
      dr: domain.dr || 0,
      tasks: tasksString,
      createdAt: domain.createdAt,
      updatedAt: new Date().toISOString(),
    },
  };
};

// Convert Airtable record to domain object
const airtableRecordToDomain = (record: any) => {
  const fields = record.fields;
  let tasks;

  try {
    tasks = JSON.parse(fields.tasks);
  } catch (error) {
    console.error("Error parsing tasks JSON:", error);
    tasks = {};
  }

  return {
    id: fields.id,
    name: fields.name,
    url: fields.url,
    da: fields.da,
    dr: fields.dr,
    tasks,
    createdAt: fields.createdAt,
    updatedAt: fields.updatedAt,
  };
};

// Fetch all domains from Airtable
export const fetchDomains = async () => {
  try {
    if (!config.apiKey || !config.baseId) {
      console.error("Airtable API key or base ID not set");
      return [];
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records.map(airtableRecordToDomain);
  } catch (error) {
    console.error("Error fetching domains from Airtable:", error);
    return [];
  }
};

// Create a new domain in Airtable
export const createDomain = async (domain: any) => {
  try {
    if (!config.apiKey || !config.baseId) {
      console.error("Airtable API key or base ID not set");
      return null;
    }

    const record = domainToAirtableRecord(domain);

    const response = await fetch(
      `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [record],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return airtableRecordToDomain(data.records[0]);
  } catch (error) {
    console.error("Error creating domain in Airtable:", error);
    return null;
  }
};

// Update an existing domain in Airtable
export const updateDomain = async (domain: any) => {
  try {
    if (!config.apiKey || !config.baseId) {
      console.error("Airtable API key or base ID not set");
      return null;
    }

    // First, find the Airtable record ID for this domain
    const allDomains = await fetchDomains();
    const existingDomain = allDomains.find((d: any) => d.id === domain.id);

    if (!existingDomain || !existingDomain.airtableId) {
      console.error("Domain not found in Airtable");
      return null;
    }

    const record = domainToAirtableRecord(domain);

    const response = await fetch(
      `https://api.airtable.com/v0/${config.baseId}/${config.tableName}/${existingDomain.airtableId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      },
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return airtableRecordToDomain(data);
  } catch (error) {
    console.error("Error updating domain in Airtable:", error);
    return null;
  }
};

// Delete a domain from Airtable
export const deleteDomain = async (domainId: string) => {
  try {
    if (!config.apiKey || !config.baseId) {
      console.error("Airtable API key or base ID not set");
      return false;
    }

    // First, find the Airtable record ID for this domain
    const allDomains = await fetchDomains();
    const existingDomain = allDomains.find((d: any) => d.id === domainId);

    if (!existingDomain || !existingDomain.airtableId) {
      console.error("Domain not found in Airtable");
      return false;
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${config.baseId}/${config.tableName}/${existingDomain.airtableId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting domain from Airtable:", error);
    return false;
  }
};

// Create multiple domains in Airtable
export const createMultipleDomains = async (domains: any[]) => {
  try {
    if (!config.apiKey || !config.baseId) {
      console.error("Airtable API key or base ID not set");
      return [];
    }

    const records = domains.map(domainToAirtableRecord);

    const response = await fetch(
      `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records.map(airtableRecordToDomain);
  } catch (error) {
    console.error("Error creating multiple domains in Airtable:", error);
    return [];
  }
};

// Migrate existing localStorage data to Airtable
export const migrateLocalStorageToAirtable = async () => {
  try {
    // Get domains from localStorage
    const domainsJson = localStorage.getItem("domains");
    if (!domainsJson) {
      console.log("No domains found in localStorage to migrate");
      return [];
    }

    const domains = JSON.parse(domainsJson);
    if (!Array.isArray(domains) || domains.length === 0) {
      console.log("No domains found in localStorage to migrate");
      return [];
    }

    // Create domains in Airtable
    const createdDomains = await createMultipleDomains(domains);

    if (createdDomains.length > 0) {
      console.log(
        `Successfully migrated ${createdDomains.length} domains to Airtable`,
      );
      // Clear localStorage after successful migration
      localStorage.removeItem("domains");
    }

    return createdDomains;
  } catch (error) {
    console.error("Error migrating domains to Airtable:", error);
    return [];
  }
};
