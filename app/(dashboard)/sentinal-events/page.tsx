"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface SentinelEvent {
  id: string;
  date: string;
  tool: string;
  severity: string;
  category: string;
  status: string;
  site: string;
  description: string;
  reporter: string;
}

interface FormData {
  tool: string;
  severity: string;
  category: string;
  site: string;
  date: string;
  description: string;
  reporter: string;
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Search
} from "lucide-react";
import DynamicSummaryCards, { SummaryCardData } from "@/components/dynamicSummaryCard";

const sentinelEvents = [
  {
    id: "SE-2025-012",
    date: "2025-12-05",
    tool: "Gleamer BoneView",
    severity: "high",
    category: "False Negative",
    status: "under-review",
    site: "Site A",
    description: "Missed fracture in elderly patient, detected during follow-up",
    reporter: "Dr. Sarah Johnson"
  },
  {
    id: "SE-2025-011",
    date: "2025-12-03",
    tool: "Aidoc Brain CT",
    severity: "critical",
    category: "System Error",
    status: "resolved",
    site: "Site B",
    description: "System timeout during stroke evaluation, manual review required",
    reporter: "Dr. Michael Chen"
  },
  {
    id: "SE-2025-010",
    date: "2025-11-28",
    tool: "Viz.ai Stroke",
    severity: "medium",
    category: "False Positive",
    status: "resolved",
    site: "Site C",
    description: "Artifact misclassified as hemorrhage, no patient harm",
    reporter: "Dr. Emily Rodriguez"
  },
  {
    id: "SE-2025-009",
    date: "2025-11-25",
    tool: "Arterys Cardiac",
    severity: "high",
    category: "Bias Issue",
    status: "investigating",
    site: "Site D",
    description: "Performance degradation in pediatric cases",
    reporter: "Dr. James Wilson"
  },
  {
    id: "SE-2025-008",
    date: "2025-11-20",
    tool: "Gleamer BoneView",
    severity: "low",
    category: "Near Miss",
    status: "resolved",
    site: "Site A",
    description: "Low confidence score prompted appropriate manual review",
    reporter: "Dr. Lisa Anderson"
  }
];

const trendData = [
  { month: "May", total: 3, critical: 0, high: 1, medium: 2, low: 0 },
  { month: "Jun", total: 4, critical: 1, high: 1, medium: 1, low: 1 },
  { month: "Jul", total: 2, critical: 0, high: 0, medium: 1, low: 1 },
  { month: "Aug", total: 5, critical: 0, high: 2, medium: 2, low: 1 },
  { month: "Sep", total: 3, critical: 1, high: 0, medium: 1, low: 1 },
  { month: "Oct", total: 4, critical: 0, high: 1, medium: 2, low: 1 },
  { month: "Nov", total: 6, critical: 0, high: 2, medium: 3, low: 1 },
  { month: "Dec", total: 2, critical: 1, high: 1, medium: 0, low: 0 }
];

const categoryData = [
  { name: "False Negative", value: 8, fill: "#ef4444" },
  { name: "False Positive", value: 6, fill: "#f59e0b" },
  { name: "System Error", value: 4, fill: "#8b5cf6" },
  { name: "Bias Issue", value: 3, fill: "#ec4899" },
  { name: "Near Miss", value: 8, fill: "#22c55e" }
];

const severityByTool = [
  { tool: "Gleamer BoneView", critical: 1, high: 3, medium: 5, low: 3 },
  { tool: "Aidoc Brain CT", critical: 2, high: 2, medium: 4, low: 2 },
  { tool: "Viz.ai Stroke", critical: 0, high: 1, medium: 3, low: 2 },
  { tool: "Arterys Cardiac", critical: 1, high: 3, medium: 2, low: 1 }
];

export default function SentinelEventsPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<SentinelEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [formData, setFormData] = useState<FormData>({
    tool: "",
    severity: "",
    category: "",
    site: "",
    date: "",
    description: "",
    reporter: ""
  });

  const summaryCards: SummaryCardData[] = [
    {
      title: "Total Events",
      value: 29,
      changeValue: 0,
      icon: "calendar",
      bgColor: "blue",
      changeLabel: "Last 12 months"
    },
    {
      title: "Open Cases",
      value: 3,
      changeValue: 0,
      icon: "clock",
      bgColor: "orange",
      changeLabel: "Require action"
    },
    {
      title: "Resolved (30d)",
      value: 6,
      changeValue: 75,
      icon: "checkCircle",
      bgColor: "green",
      changeLabel: "resolution rate"
    },
    {
      title: "Avg. Resolution Time",
      value: 4.2,
      changeValue: -12,
      icon: "clock",
      bgColor: "purple",
      suffix: "d",
      changeLabel: "vs last month"
    }
  ];

  const handleOpenModal = (event: SentinelEvent | null = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        tool: event.tool,
        severity: event.severity,
        category: event.category,
        site: event.site,
        date: event.date,
        description: event.description,
        reporter: event.reporter
      });
    } else {
      setEditingEvent(null);
      setFormData({
        tool: "",
        severity: "",
        category: "",
        site: "",
        date: "",
        description: "",
        reporter: ""
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      tool: "",
      severity: "",
      category: "",
      site: "",
      date: "",
      description: "",
      reporter: ""
    });
  };

  const handleSubmit = () => {
    console.log(editingEvent ? "Updating event:" : "Creating event:", formData);
    handleCloseModal();
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; className: string }> = {
      critical: { variant: "destructive", className: "bg-red-600 text-white" },
      high: { variant: "destructive", className: "bg-orange-500 text-white" },
      medium: { variant: "secondary", className: "bg-yellow-500 text-white" },
      low: { variant: "default", className: "bg-green-500 text-white" }
    };
    const config = variants[severity] || variants.low;
    return (
      <Badge variant={config.variant} className={config.className}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      resolved: "default",
      "under-review": "secondary",
      investigating: "secondary"
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "under-review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "investigating":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Sentinel Events</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Track and manage adverse events and near misses
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Log New Event
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Sentinel Event" : "Log Sentinel Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update the event details below." : "Fill in the details to log a new sentinel event."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tool">AI Tool</Label>
              <Select value={formData.tool} onValueChange={(value) => setFormData({...formData, tool: value})}>
                <SelectTrigger id="tool">
                  <SelectValue placeholder="Select tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gleamer BoneView">Gleamer BoneView</SelectItem>
                  <SelectItem value="Aidoc Brain CT">Aidoc Brain CT</SelectItem>
                  <SelectItem value="Viz.ai Stroke">Viz.ai Stroke</SelectItem>
                  <SelectItem value="Arterys Cardiac">Arterys Cardiac</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="False Negative">False Negative</SelectItem>
                    <SelectItem value="False Positive">False Positive</SelectItem>
                    <SelectItem value="System Error">System Error</SelectItem>
                    <SelectItem value="Bias Issue">Bias Issue</SelectItem>
                    <SelectItem value="Near Miss">Near Miss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="site">Site</Label>
                <Input 
                  id="site" 
                  placeholder="Enter site name" 
                  value={formData.site}
                  onChange={(e) => setFormData({...formData, site: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed description of the event..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reporter">Reporter Name</Label>
              <Input 
                id="reporter" 
                placeholder="Enter your name" 
                value={formData.reporter}
                onChange={(e) => setFormData({...formData, reporter: e.target.value})}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseModal} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="w-full sm:w-auto">
                {editingEvent ? "Update Event" : "Submit Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DynamicSummaryCards cards={summaryCards} />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Events by Severity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={2} name="Critical" />
                  <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} name="High" />
                  <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} name="Medium" />
                  <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Severity Distribution by AI Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityByTool}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tool" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" />
                <Bar dataKey="high" stackId="a" fill="#f59e0b" name="High" />
                <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" />
                <Bar dataKey="low" stackId="a" fill="#22c55e" name="Low" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base sm:text-lg">Recent Events</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentinelEvents.map((event) => (
              <div key={event.id} className="rounded-lg border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm sm:text-base">{event.id}</span>
                      {getSeverityBadge(event.severity)}
                      <Badge variant="outline" className="text-xs">{event.category}</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {event.tool} • {event.site} • {event.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(event.status)}
                    {getStatusBadge(event.status)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm mb-3">{event.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Reported by: {event.reporter}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => handleOpenModal(event)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      <FileText className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}