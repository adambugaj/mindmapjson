import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  CheckSquare,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";

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
  createdAt: string;
  showTasks?: boolean;
}

interface DomainTableProps {
  domains?: Domain[];
  onEdit?: (domain: Domain) => void;
  onDelete?: (domain: Domain) => void;
  onViewTasks?: (domain: Domain) => void;
}

const DomainTable: React.FC<DomainTableProps> = ({
  domains = [
    {
      id: "1",
      name: "example-domain",
      url: "https://example-domain.com",
      tasks: {
        installation: true,
        configuration: true,
        gscSetup: false,
        content: false,
        wwwStatus: false,
        uxPublishing: false,
        traffic: false,
        monetization: false,
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "another-domain",
      url: "https://another-domain.com",
      tasks: {
        installation: true,
        configuration: true,
        gscSetup: true,
        content: true,
        wwwStatus: true,
        uxPublishing: false,
        traffic: false,
        monetization: false,
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "test-domain",
      url: "https://test-domain.com",
      tasks: {
        installation: true,
        configuration: true,
        gscSetup: true,
        content: true,
        wwwStatus: true,
        uxPublishing: true,
        traffic: true,
        monetization: true,
      },
      createdAt: new Date().toISOString(),
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
  onViewTasks = () => {},
}) => {
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>(
    domains.map((domain) => ({ ...domain, showTasks: false })),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Domain | null;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    // Filter domains based on search term
    const filtered = domains.filter(
      (domain) =>
        domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.url.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Sort domains based on sort config
    const sorted = [...filtered].sort((a, b) => {
      if (!sortConfig.key) return 0;

      if (sortConfig.key === "name" || sortConfig.key === "url") {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();

        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (sortConfig.key === "createdAt") {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();

        if (sortConfig.direction === "asc") {
          return aDate - bDate;
        } else {
          return bDate - aDate;
        }
      }

      return 0;
    });

    // Preserve showTasks state when filtering/sorting
    const newFilteredDomains = sorted.map((domain) => {
      const existingDomain = filteredDomains.find((d) => d.id === domain.id);
      return {
        ...domain,
        showTasks: existingDomain ? existingDomain.showTasks : false,
      };
    });

    setFilteredDomains(newFilteredDomains);
  }, [domains, searchTerm, sortConfig]);

  const handleSort = (key: keyof Domain) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const calculateProgress = (tasks: Domain["tasks"]) => {
    const totalTasks = Object.keys(tasks).length;
    if (totalTasks === 0) return 0;
    const completedTasks = Object.values(tasks).filter(Boolean).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Domains</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>Not Started</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredDomains.length} domain
          {filteredDomains.length !== 1 ? "s" : ""}
        </div>
      </div>

      <Table>
        <TableCaption>List of managed PBN domains</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1">
                Domain Name
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">DA/DR</TableHead>
            <TableHead className="hidden md:table-cell">Progress</TableHead>
            <TableHead className="hidden md:table-cell">Tasks</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center gap-1">
                Created
                {sortConfig.key === "createdAt" &&
                  (sortConfig.direction === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDomains.length > 0 ? (
            filteredDomains.map((domain) => {
              const progress = calculateProgress(domain.tasks);
              return (
                <React.Fragment key={domain.id}>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{domain.name}</span>
                        <a
                          href={domain.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {domain.da && (
                          <Badge variant="outline" className="bg-blue-50">
                            DA {domain.da}
                          </Badge>
                        )}
                        {domain.dr && (
                          <Badge variant="outline" className="bg-green-50">
                            DR {domain.dr}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={progress}
                          className={`h-2 w-24 ${progress < 25 ? "bg-red-100" : progress < 50 ? "bg-yellow-100" : progress < 75 ? "bg-blue-100" : "bg-green-100"}`}
                          indicatorClassName={`${progress < 25 ? "bg-red-500" : progress < 50 ? "bg-yellow-500" : progress < 75 ? "bg-blue-500" : "bg-green-500"}`}
                        />
                        <span className="text-sm">{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex gap-1">
                          <Checkbox
                            id={`installation-${domain.id}`}
                            checked={domain.tasks.installation}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  installation: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`installation-${domain.id}`}
                            className={`text-xs ${domain.tasks.installation ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Install
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`configuration-${domain.id}`}
                            checked={domain.tasks.configuration}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  configuration: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`configuration-${domain.id}`}
                            className={`text-xs ${domain.tasks.configuration ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Config
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`gscSetup-${domain.id}`}
                            checked={domain.tasks.gscSetup}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  gscSetup: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`gscSetup-${domain.id}`}
                            className={`text-xs ${domain.tasks.gscSetup ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            GSC
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`content-${domain.id}`}
                            checked={domain.tasks.content}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  content: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`content-${domain.id}`}
                            className={`text-xs ${domain.tasks.content ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Content
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`wwwStatus-${domain.id}`}
                            checked={domain.tasks.wwwStatus}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  wwwStatus: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`wwwStatus-${domain.id}`}
                            className={`text-xs ${domain.tasks.wwwStatus ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            WWW
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`uxPublishing-${domain.id}`}
                            checked={domain.tasks.uxPublishing}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  uxPublishing: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`uxPublishing-${domain.id}`}
                            className={`text-xs ${domain.tasks.uxPublishing ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            UX
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`traffic-${domain.id}`}
                            checked={domain.tasks.traffic}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  traffic: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`traffic-${domain.id}`}
                            className={`text-xs ${domain.tasks.traffic ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Traffic
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <Checkbox
                            id={`monetization-${domain.id}`}
                            checked={domain.tasks.monetization}
                            onCheckedChange={(checked) => {
                              onViewTasks({
                                ...domain,
                                tasks: {
                                  ...domain.tasks,
                                  monetization: !!checked,
                                },
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`monetization-${domain.id}`}
                            className={`text-xs ${domain.tasks.monetization ? "text-green-600 font-medium" : "text-gray-500"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Money
                          </label>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(domain.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="md:hidden"
                          onClick={() => {
                            setFilteredDomains((prev) =>
                              prev.map((d) =>
                                d.id === domain.id
                                  ? { ...d, showTasks: !d.showTasks }
                                  : d,
                              ),
                            );
                          }}
                          title="Toggle Tasks"
                        >
                          {domain.showTasks ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onViewTasks(domain)}
                          title="View Tasks"
                        >
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(domain)}
                          title="Edit Domain"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => onDelete(domain)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  {domain.showTasks && (
                    <TableRow className="md:hidden">
                      <TableCell colSpan={5} className="p-2">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Progress
                              value={progress}
                              className={`h-2 flex-1 ${progress < 25 ? "bg-red-100" : progress < 50 ? "bg-yellow-100" : progress < 75 ? "bg-blue-100" : "bg-green-100"}`}
                              indicatorClassName={`${progress < 25 ? "bg-red-500" : progress < 50 ? "bg-yellow-500" : progress < 75 ? "bg-blue-500" : "bg-green-500"}`}
                            />
                            <span className="text-sm">{progress}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-installation-${domain.id}`}
                                checked={domain.tasks.installation}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      installation: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-installation-${domain.id}`}
                                className={`text-sm ${domain.tasks.installation ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Installation
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-configuration-${domain.id}`}
                                checked={domain.tasks.configuration}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      configuration: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-configuration-${domain.id}`}
                                className={`text-sm ${domain.tasks.configuration ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Configuration
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-gscSetup-${domain.id}`}
                                checked={domain.tasks.gscSetup}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      gscSetup: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-gscSetup-${domain.id}`}
                                className={`text-sm ${domain.tasks.gscSetup ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                GSC Setup
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-content-${domain.id}`}
                                checked={domain.tasks.content}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      content: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-content-${domain.id}`}
                                className={`text-sm ${domain.tasks.content ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Content
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-wwwStatus-${domain.id}`}
                                checked={domain.tasks.wwwStatus}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      wwwStatus: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-wwwStatus-${domain.id}`}
                                className={`text-sm ${domain.tasks.wwwStatus ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                WWW Status
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-uxPublishing-${domain.id}`}
                                checked={domain.tasks.uxPublishing}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      uxPublishing: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-uxPublishing-${domain.id}`}
                                className={`text-sm ${domain.tasks.uxPublishing ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                UX Publishing
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-traffic-${domain.id}`}
                                checked={domain.tasks.traffic}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      traffic: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-traffic-${domain.id}`}
                                className={`text-sm ${domain.tasks.traffic ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Traffic
                              </label>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Checkbox
                                id={`mobile-monetization-${domain.id}`}
                                checked={domain.tasks.monetization}
                                onCheckedChange={(checked) => {
                                  onViewTasks({
                                    ...domain,
                                    tasks: {
                                      ...domain.tasks,
                                      monetization: !!checked,
                                    },
                                  });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={`mobile-monetization-${domain.id}`}
                                className={`text-sm ${domain.tasks.monetization ? "text-green-600 font-medium" : "text-gray-500"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Monetization
                              </label>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground"
              >
                No domains found. Try adjusting your search or add a new domain.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DomainTable;
