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
} from "lucide-react";
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
  createdAt: string;
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
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>(domains);
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

    setFilteredDomains(sorted);
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
    const completedTasks = Object.values(tasks).filter(Boolean).length;
    return (completedTasks / totalTasks) * 100;
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
            <TableHead className="w-[80px]">ID</TableHead>
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
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("url")}
            >
              <div className="flex items-center gap-1">
                URL
                {sortConfig.key === "url" &&
                  (sortConfig.direction === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead>Progress</TableHead>
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
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.id}</TableCell>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>
                    <a
                      href={domain.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {domain.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-2 w-24" />
                      <span className="text-sm">{Math.round(progress)}%</span>
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
