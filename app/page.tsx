"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
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
  Label
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Settings,
  TrendingUp
} from "lucide-react";
import DynamicSummaryCards, { SummaryCardData } from "@/components/dynamicSummaryCard";

const aiTools = [
  {
    name: "Gleamer BoneView",
    version: "v2.4.1",
    riskLevel: "low",
    status: "active",
    lastValidation: "2025-12-01",
    drift: "normal",
    issues: 0,
    sites: 21
  },
  {
    name: "Aidoc Brain CT",
    version: "v3.1.2",
    riskLevel: "medium",
    status: "active",
    lastValidation: "2025-11-28",
    drift: "minor",
    issues: 2,
    sites: 15
  },
  {
    name: "Viz.ai Stroke",
    version: "v4.0.5",
    riskLevel: "low",
    status: "active",
    lastValidation: "2025-12-03",
    drift: "normal",
    issues: 0,
    sites: 18
  },
  {
    name: "Arterys Cardiac",
    version: "v2.8.1",
    riskLevel: "high",
    status: "review",
    lastValidation: "2025-11-15",
    drift: "significant",
    issues: 5,
    sites: 8
  }
];

const validationTrendData = [
  { month: "May", completed: 12, failed: 1 },
  { month: "Jun", completed: 15, failed: 2 },
  { month: "Jul", completed: 14, failed: 1 },
  { month: "Aug", completed: 18, failed: 3 },
  { month: "Sep", completed: 16, failed: 2 },
  { month: "Oct", completed: 20, failed: 1 },
  { month: "Nov", completed: 19, failed: 2 },
  { month: "Dec", completed: 14, failed: 1 }
];

const performanceData = [
  { month: "May", agreement: 88, sensitivity: 91, specificity: 90 },
  { month: "Jun", agreement: 89, sensitivity: 92, specificity: 91 },
  { month: "Jul", agreement: 89.5, sensitivity: 92.5, specificity: 91.5 },
  { month: "Aug", agreement: 90, sensitivity: 93, specificity: 92 },
  { month: "Sep", agreement: 90.5, sensitivity: 93.5, specificity: 92.5 },
  { month: "Oct", agreement: 91, sensitivity: 94, specificity: 93 },
  { month: "Nov", agreement: 91.5, sensitivity: 94.2, specificity: 93.5 },
  { month: "Dec", agreement: 92, sensitivity: 94.5, specificity: 94 }
];

const riskDistribution = [
  { name: "Low Risk", value: 2, fill: "#22c55e" },
  { name: "Medium Risk", value: 1, fill: "#eab308" },
  { name: "High Risk", value: 1, fill: "#ef4444" }
];

const issuesByCategory = [
  { category: "Performance", count: 3 },
  { category: "Bias", count: 2 },
  { category: "Drift", count: 1 },
  { category: "Safety", count: 1 }
];

export default function GovernanceDashboard() {

  const summaryCards: SummaryCardData[] = [
    {
      title: "Active Models",
      value: 12,
      changeValue: 2,
      icon: "checkCircle",
      bgColor: "green",
      changeLabel: "new this quarter"
    },
    {
      title: "Turnaround Time",
      value: -3,
      changeValue: -15,
      icon: "clock",
      bgColor: "blue",
      prefix: "",
      suffix: " min",
      changeLabel: "improvement vs baseline"
    },
    {
      title: "Throughput",
      value: 4,
      changeValue: 12,
      icon: "trendingUp",
      bgColor: "purple",
      suffix: " hr+",
      changeLabel: "capacity increase"
    },
    {
      title: "Pending Reviews",
      value: 5,
      changeValue: -3,
      icon: "alertCircle",
      bgColor: "orange",
      changeLabel: "requiring attention"
    }
  ];

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; className: string }> = {
      low: { variant: "default", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
      medium: { variant: "secondary", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" },
      high: { variant: "destructive", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" }
    };
    const config = variants[risk];
    return (
      <Badge variant={config.variant} className={config.className}>
        {risk.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "review":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Governance Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage AI tools across your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      <DynamicSummaryCards cards={summaryCards} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Tools Status</CardTitle>
            <p className="text-sm text-muted-foreground">Current deployment overview</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiTools.map((tool, idx) => (
                <div key={idx} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{tool.name}</h3>
                        <Badge variant="outline">{tool.version}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Deployed across {tool.sites} sites
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tool.status)}
                      {getRiskBadge(tool.riskLevel)}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Last Validation</p>
                      <p className="font-medium">{tool.lastValidation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Drift Status</p>
                      <Badge
                        variant="outline"
                        className={
                          tool.drift === "normal"
                            ? "text-green-600 border-green-600"
                            : tool.drift === "minor"
                              ? "text-yellow-600 border-yellow-600"
                              : "text-red-600 border-red-600"
                        }>
                        {tool.drift}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Open Issues</p>
                      <p className={`font-medium ${tool.issues > 0 ? "text-red-600" : "text-green-600"}`}>
                        {tool.issues}
                      </p>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[200px]">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}>
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                                4
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                                Tools
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {riskDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issuesByCategory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${(item.count / 7) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Validation Runs Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Last 8 months</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <BarChart data={validationTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Aggregate across all tools</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[85, 95]} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="agreement"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  name="Agreement"
                />
                <Line
                  type="monotone"
                  dataKey="sensitivity"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Sensitivity"
                />
                <Line
                  type="monotone"
                  dataKey="specificity"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  name="Specificity"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-950 p-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Validation completed</p>
                  <p className="text-xs text-muted-foreground">Gleamer BoneView - Site A</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-950 p-1.5">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Drift detected</p>
                  <p className="text-xs text-muted-foreground">Aidoc Brain CT - Performance</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-100 dark:bg-red-950 p-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">High-priority issue</p>
                  <p className="text-xs text-muted-foreground">Arterys Cardiac - Bias detected</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Performance improved</p>
                  <p className="text-xs text-muted-foreground">Viz.ai Stroke - +3.2% sensitivity</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1">Start Validation Run</div>
                  <div className="text-xs text-muted-foreground">
                    Initiate new validation for deployed models
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1">Review Bias Radar</div>
                  <div className="text-xs text-muted-foreground">
                    Check fairness metrics across cohorts
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1">Log Sentinel Event</div>
                  <div className="text-xs text-muted-foreground">
                    Report adverse events or near misses
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1">View Transparency Reports</div>
                  <div className="text-xs text-muted-foreground">
                    Access model cards and documentation
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}