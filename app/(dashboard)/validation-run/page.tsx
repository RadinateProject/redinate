"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import DynamicSummaryCards from "@/components/dynamicSummaryCard";

// Type definitions
type IconName = "checkCircle" | "clock" | "alertCircle" | "download";
type BgColorName = "indigo" | "green" | "purple" | "orange" | "blue" | "red" | "pink" | "yellow";

interface SummaryCardData {
  title: string;
  value: number;
  changeValue: number;
  icon: IconName;
  bgColor: BgColorName;
  prefix?: string;
  suffix?: string;
  changeLabel?: string;
}

interface ValidationRun {
  id: string;
  model: string;
  version: string;
  site: string;
  status: "completed" | "in-progress" | "failed";
  date: string;
  studies: number;
  groundTruth: string;
  sensitivity: string;
  specificity: string;
}

const validationRuns: ValidationRun[] = [
  {
    id: "VR-2025-001",
    model: "Gleamer BoneView",
    version: "v2.4.1",
    site: "All Sites (21)",
    status: "completed",
    date: "2025-12-01",
    studies: 1487203,
    groundTruth: "93%",
    sensitivity: "92%",
    specificity: "94%"
  },
  {
    id: "VR-2025-002",
    model: "Gleamer BoneView",
    version: "v2.4.1",
    site: "Site A",
    status: "in-progress",
    date: "2025-12-05",
    studies: 45632,
    groundTruth: "89%",
    sensitivity: "88%",
    specificity: "91%"
  },
  {
    id: "VR-2025-003",
    model: "Gleamer BoneView",
    version: "v2.3.8",
    site: "Site B",
    status: "completed",
    date: "2025-11-28",
    studies: 78234,
    groundTruth: "91%",
    sensitivity: "90%",
    specificity: "93%"
  },
  {
    id: "VR-2025-004",
    model: "Gleamer BoneView",
    version: "v2.4.1",
    site: "Site C",
    status: "failed",
    date: "2025-12-03",
    studies: 23411,
    groundTruth: "76%",
    sensitivity: "75%",
    specificity: "78%"
  },
  {
    id: "VR-2025-005",
    model: "Gleamer BoneView",
    version: "v2.4.0",
    site: "All Sites (21)",
    status: "completed",
    date: "2025-11-20",
    studies: 1423567,
    groundTruth: "92%",
    sensitivity: "91%",
    specificity: "93%"
  }
];

export default function ValidationRunsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate summary statistics
  const totalRuns = validationRuns.length;
  const completedRuns = validationRuns.filter(r => r.status === "completed").length;
  const inProgressRuns = validationRuns.filter(r => r.status === "in-progress").length;
  const failedRuns = validationRuns.filter(r => r.status === "failed").length;
  const totalStudies = validationRuns.reduce((sum, r) => sum + r.studies, 0);

  // Calculate average metrics for completed runs
  const completedRunsData = validationRuns.filter(r => r.status === "completed");
  const avgGroundTruth = completedRunsData.length > 0 
    ? Math.round(completedRunsData.reduce((sum, r) => sum + parseInt(r.groundTruth), 0) / completedRunsData.length)
    : 0;
  const avgSensitivity = completedRunsData.length > 0
    ? Math.round(completedRunsData.reduce((sum, r) => sum + parseInt(r.sensitivity), 0) / completedRunsData.length)
    : 0;

  // Summary cards data
  const summaryCardsData: SummaryCardData[] = [
    {
      title: "Total Validation Runs",
      value: totalRuns,
      changeValue: 15.3,
      icon: "download",
      bgColor: "indigo",
      changeLabel: "from last month"
    },
    {
      title: "Completed Runs",
      value: completedRuns,
      changeValue: 12.5,
      icon: "checkCircle",
      bgColor: "green",
      changeLabel: "from last month"
    },
    {
      title: "In Progress",
      value: inProgressRuns,
      changeValue: 0,
      icon: "clock",
      bgColor: "blue",
      changeLabel: "active now"
    },
    {
      title: "Failed Runs",
      value: failedRuns,
      changeValue: -5.2,
      icon: "alertCircle",
      bgColor: "red",
      changeLabel: "from last month"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      "in-progress": "secondary",
      failed: "destructive"
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const filteredRuns = validationRuns.filter((run) => {
    const matchesStatus = statusFilter === "all" || run.status === statusFilter;
    const matchesSearch =
      run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.site.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Validation Runs</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage AI model validation runs across all sites
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 ">
        <DynamicSummaryCards cards={summaryCardsData} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Validation Runs</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search runs..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Studies</TableHead>
                <TableHead className="text-right">Ground Truth</TableHead>
                <TableHead className="text-right">Sensitivity</TableHead>
                <TableHead className="text-right">Specificity</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRuns.map((run) => (
                <TableRow key={run.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{run.id}</TableCell>
                  <TableCell>{run.model}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{run.version}</Badge>
                  </TableCell>
                  <TableCell>{run.site}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      {getStatusBadge(run.status)}
                    </div>
                  </TableCell>
                  <TableCell>{run.date}</TableCell>
                  <TableCell className="text-right">
                    {run.studies.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        parseInt(run.groundTruth) >= 90
                          ? "text-green-600 font-medium"
                          : parseInt(run.groundTruth) >= 80
                            ? "text-yellow-600 font-medium"
                            : "text-red-600 font-medium"
                      }>
                      {run.groundTruth}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        parseInt(run.sensitivity) >= 90
                          ? "text-green-600 font-medium"
                          : parseInt(run.sensitivity) >= 80
                            ? "text-yellow-600 font-medium"
                            : "text-red-600 font-medium"
                      }>
                      {run.sensitivity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        parseInt(run.specificity) >= 90
                          ? "text-green-600 font-medium"
                          : parseInt(run.specificity) >= 80
                            ? "text-yellow-600 font-medium"
                            : "text-red-600 font-medium"
                      }>
                      {run.specificity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}