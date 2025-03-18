import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Minus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Progress } from "../ui/progress";

export interface Domain {
  id: string;
  name: string;
  url: string;
  tasks: {
    installation: boolean;
    configuration: boolean;
    gscSetup: boolean;
    content: boolean;
    wwwStatus: boolean;
    uxPublishing: boolean;
    traffic: boolean;
    monetization: boolean;
  };
  notes?: string;
}

interface MindMapViewProps {
  domains?: Domain[];
  onDomainSelect?: (domain: Domain) => void;
}

const MindMapView: React.FC<MindMapViewProps> = ({
  domains = [
    {
      id: "1",
      name: "example.com",
      url: "https://example.com",
      tasks: {
        installation: true,
        configuration: true,
        gscSetup: false,
        content: false,
        wwwStatus: true,
        uxPublishing: false,
        traffic: false,
        monetization: false,
      },
    },
    {
      id: "2",
      name: "sample.org",
      url: "https://sample.org",
      tasks: {
        installation: true,
        configuration: true,
        gscSetup: true,
        content: true,
        wwwStatus: true,
        uxPublishing: true,
        traffic: false,
        monetization: false,
      },
    },
    {
      id: "3",
      name: "test.net",
      url: "https://test.net",
      tasks: {
        installation: true,
        configuration: false,
        gscSetup: false,
        content: false,
        wwwStatus: false,
        uxPublishing: false,
        traffic: false,
        monetization: false,
      },
    },
  ],
  onDomainSelect = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>(domains);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setFilteredDomains(
      domains.filter(
        (domain) =>
          domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          domain.url.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, domains]);

  const calculateProgress = (tasks: Domain["tasks"]) => {
    const totalTasks = Object.keys(tasks).length;
    const completedTasks = Object.values(tasks).filter(Boolean).length;
    return (completedTasks / totalTasks) * 100;
  };

  const getNodeColor = (progress: number) => {
    if (progress < 25) return "bg-red-100 border-red-300";
    if (progress < 50) return "bg-orange-100 border-orange-300";
    if (progress < 75) return "bg-yellow-100 border-yellow-300";
    return "bg-green-100 border-green-300";
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="w-full h-full bg-white p-4 rounded-md shadow-sm flex flex-col">
      <div className="flex items-center mb-4 gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={zoomOut}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={zoomIn}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border rounded-md p-4 relative">
        <motion.div
          className="min-w-full min-h-full flex items-center justify-center"
          style={{
            scale: zoom,
            transformOrigin: "center center",
          }}
        >
          {/* Central hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 border-2 border-blue-300 rounded-full w-32 h-32 flex items-center justify-center z-10 shadow-md">
            <div className="text-center">
              <div className="font-bold">Domain Hub</div>
              <div className="text-sm text-gray-600">
                {filteredDomains.length} domains
              </div>
            </div>
          </div>

          {/* Domain nodes */}
          {filteredDomains.map((domain, index) => {
            const progress = calculateProgress(domain.tasks);
            const angle =
              index * (360 / filteredDomains.length) * (Math.PI / 180);
            const radius = 200; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <TooltipProvider key={domain.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`absolute cursor-pointer ${getNodeColor(progress)} border-2 rounded-lg w-40 h-28 flex flex-col items-center justify-center shadow-md`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onDomainSelect(domain)}
                    >
                      <div className="text-center p-2">
                        <div className="font-semibold truncate w-full">
                          {domain.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate w-full">
                          {domain.url}
                        </div>
                        <div className="mt-2 w-full px-2">
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-center mt-1">
                            {Math.round(progress)}%
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <div className="font-bold">{domain.name}</div>
                      <div className="text-xs">{domain.url}</div>
                      <div className="mt-1 text-xs">
                        Progress: {Math.round(progress)}%
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}

          {/* Connection lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {filteredDomains.map((domain, index) => {
              const angle =
                index * (360 / filteredDomains.length) * (Math.PI / 180);
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <line
                  key={domain.id}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${x}px)`}
                  y2={`calc(50% + ${y}px)`}
                  stroke="#CBD5E0"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default MindMapView;
