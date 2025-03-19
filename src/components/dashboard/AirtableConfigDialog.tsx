import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  setAirtableConfig,
  migrateLocalStorageToAirtable,
} from "../../lib/airtableClient";

interface AirtableConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSaved: () => void;
}

const AirtableConfigDialog: React.FC<AirtableConfigDialogProps> = ({
  open,
  onOpenChange,
  onConfigSaved,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [baseId, setBaseId] = useState("");
  const [tableName, setTableName] = useState("Domains");
  const [isMigrating, setIsMigrating] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!apiKey || !baseId) {
      setError("API Key and Base ID are required");
      return;
    }

    try {
      // Save Airtable configuration
      setAirtableConfig({
        apiKey,
        baseId,
        tableName: tableName || "Domains",
      });

      // Migrate existing data
      setIsMigrating(true);
      await migrateLocalStorageToAirtable();
      setIsMigrating(false);

      // Save config to localStorage for persistence
      localStorage.setItem(
        "airtableConfig",
        JSON.stringify({
          apiKey,
          baseId,
          tableName: tableName || "Domains",
        }),
      );

      onConfigSaved();
      onOpenChange(false);
    } catch (err) {
      console.error("Error saving Airtable config:", err);
      setError("Failed to save configuration. Please check your credentials.");
      setIsMigrating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Airtable Configuration</DialogTitle>
          <DialogDescription>
            Enter your Airtable API credentials to connect your domain
            dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Airtable API key"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="baseId" className="text-right">
              Base ID
            </Label>
            <Input
              id="baseId"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              placeholder="Enter your Airtable Base ID"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tableName" className="text-right">
              Table Name
            </Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Domains"
              className="col-span-3"
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isMigrating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isMigrating ? "Migrating data..." : "Save & Migrate Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AirtableConfigDialog;
