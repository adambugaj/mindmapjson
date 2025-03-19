import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export interface Domain {
  id: string;
  name: string;
  url: string;
  da?: number;
  dr?: number;
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
    <div className="w-full h-[calc(100vh-200px)] bg-white p-4 rounded-md shadow-sm flex flex-col">
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-32 h-32 flex items-center justify-center z-10 shadow-lg">
            <div className="text-center">
              <div className="font-bold">Domain Hub</div>
              <div className="text-sm">{filteredDomains.length} domains</div>
            </div>
          </div>

          {/* Domain nodes in a simplified grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-40">
            {filteredDomains.map((domain) => {
              const progress = calculateProgress(domain.tasks);
              const progressColor =
                progress < 30
                  ? "bg-red-500"
                  : progress < 60
                    ? "bg-yellow-500"
                    : "bg-green-500";

              return (
                <Card
                  key={domain.id}
                  className="w-full cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                  onClick={() => onDomainSelect(domain)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">{domain.name}</h3>
                      <a
                        href={domain.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="mt-2 mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressColor}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {(domain.da || domain.dr) && (
                      <div className="flex gap-1 mb-2">
                        {domain.da && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-xs"
                          >
                            DA {domain.da}
                          </Badge>
                        )}
                        {domain.dr && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-xs"
                          >
                            DR {domain.dr}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        {domain.tasks.installation ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span
                          className={
                            domain.tasks.installation
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Install
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {domain.tasks.configuration ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span
                          className={
                            domain.tasks.configuration
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Config
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {domain.tasks.gscSetup ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span
                          className={
                            domain.tasks.gscSetup
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          GSC
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {domain.tasks.content ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span
                          className={
                            domain.tasks.content
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Content
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MindMapView;
