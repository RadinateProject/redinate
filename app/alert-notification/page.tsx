"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  XCircle
} from "lucide-react";

interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  model: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  affectedSites: string[];
}

const safetyAlerts: SafetyAlert[] = [
  {
    id: "SA-2025-001",
    title: "Critical Performance Degradation Detected",
    description: "Sensitivity dropped below 85% threshold in the 65+ age group across 3 sites. Immediate review required.",
    severity: "critical",
    category: "Performance",
    model: "Gleamer BoneView",
    timestamp: "2025-12-08T14:30:00Z",
    read: false,
    actionRequired: true,
    affectedSites: ["Site A", "Site C", "Site E"]
  },
  {
    id: "SA-2025-002",
    title: "Bias Alert: Gender Disparity Increasing",
    description: "Performance gap between male and female cohorts has widened to 12% over the past month.",
    severity: "high",
    category: "Bias/Fairness",
    model: "Aidoc Brain CT",
    timestamp: "2025-12-08T12:15:00Z",
    read: false,
    actionRequired: true,
    affectedSites: ["Site B", "Site D"]
  },
  {
    id: "SA-2025-003",
    title: "Data Drift Warning",
    description: "Input data distribution has shifted significantly. Model retraining may be necessary.",
    severity: "high",
    category: "Data Quality",
    model: "Viz.ai Stroke",
    timestamp: "2025-12-08T10:00:00Z",
    read: true,
    actionRequired: true,
    affectedSites: ["Site A"]
  },
  {
    id: "SA-2025-004",
    title: "Increased False Positive Rate",
    description: "FPR increased from 3.2% to 5.8% in the past week for Lower Extremity studies.",
    severity: "medium",
    category: "Performance",
    model: "Gleamer BoneView",
    timestamp: "2025-12-07T16:45:00Z",
    read: true,
    actionRequired: false,
    affectedSites: ["Site C"]
  },
  {
    id: "SA-2025-005",
    title: "System Timeout Events",
    description: "Multiple processing timeout events reported during peak hours. System performance monitoring recommended.",
    severity: "medium",
    category: "System",
    model: "Arterys Cardiac",
    timestamp: "2025-12-07T09:30:00Z",
    read: true,
    actionRequired: false,
    affectedSites: ["Site B", "Site E"]
  },
  {
    id: "SA-2025-006",
    title: "Routine Maintenance Scheduled",
    description: "Scheduled system maintenance will occur on Dec 15, 2025. Downtime expected: 2 hours.",
    severity: "low",
    category: "Maintenance",
    model: "All Models",
    timestamp: "2025-12-06T14:00:00Z",
    read: true,
    actionRequired: false,
    affectedSites: ["All Sites"]
  },
  {
    id: "SA-2025-007",
    title: "Validation Run Completed Successfully",
    description: "Monthly validation run completed with all metrics within acceptable ranges.",
    severity: "low",
    category: "Validation",
    model: "Gleamer BoneView",
    timestamp: "2025-12-05T11:20:00Z",
    read: true,
    actionRequired: false,
    affectedSites: ["All Sites"]
  }
];

export default function SafetyAlertNotifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [alerts, setAlerts] = useState(safetyAlerts);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: "bg-red-600 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-blue-500 text-white"
    };
    return (
      <Badge className={colors[severity as keyof typeof colors] || "bg-gray-500"}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesRead = readFilter === "all" ||
      (readFilter === "unread" && !alert.read) ||
      (readFilter === "read" && alert.read);
    return matchesSearch && matchesSeverity && matchesRead;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === "critical" && !a.read).length;
  const actionRequiredCount = alerts.filter(a => a.actionRequired && !a.read).length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Safety Alert Notifications</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
            Monitor critical system alerts and notifications
          </p>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="w-full sm:w-auto"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Unread Alerts</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-red-600">{criticalCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Action Required</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-orange-600">{actionRequiredCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base sm:text-lg">All Notifications</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
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
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No alerts match your filters</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-3 sm:p-4 transition-all ${alert.read ? "bg-background" : "bg-blue-50 dark:bg-blue-950/20"
                    } hover:border-blue-500`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-shrink-0">{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {!alert.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                            )}
                            <h3 className="font-semibold text-sm sm:text-base">{alert.title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{alert.id}</span>
                            <span>•</span>
                            <span>{alert.model}</span>
                            <span>•</span>
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {getSeverityBadge(alert.severity)}
                          {alert.actionRequired && (
                            <Badge variant="outline" className="bg-orange-500 text-white border-orange-600">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm mb-3">{alert.description}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Affected: {alert.affectedSites.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(alert.id)}
                              className="text-xs h-8"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Mark as Read
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}