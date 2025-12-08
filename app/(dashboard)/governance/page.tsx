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
  TrendingUp,
  Printer,
  X
} from "lucide-react";
import DynamicSummaryCards, { SummaryCardData } from "@/components/dynamicSummaryCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample JSON data structure (will be replaced with API data)
const modelCardData = {
  metadata: {
    model_name: "Acorn 3D Software (AC-SEG-4009); Acorn 3DP Model (AC-101-XX)",
    model_version: "ICH-02-RT",
    vendor_name: "Mighty Oak Medical",
    pccp_id: "pccp-acorn-3d-software-k234009-20251203T135510.739364Z",
    export_timestamp: "2025-12-03T13:55:10.739364Z",
    intended_use: "Radiological computer-aided triage and notification software indicated for use in the analysis of non-enhanced head CT images in adults aged 18 and older, to assist hospital networks and appropriately trained medical specialists in workflow triage by flagging and communicating suspected positive findings of intracranial hemorrhage (ICH) pathologies.",
    pccp_authorized: true,
    submission_numbers: ["K234009"],
    fda_metadata: {
      primary_submission: "K234009",
      device_class: null,
      regulation_number: "",
      product_code: "",
      all_submissions: [],
      decision_date: "",
    }
  },
  impact_assessment: {
    baseline_performance: {
      metrics: {
        sensitivity: {
          value: 0.9615,
          ci: [0.9044, 0.9894],
          n: 220,
        },
        specificity: {
          value: 0.9483,
          ci: [0.8908, 0.9808],
          n: 220,
        },
      },
    },
    risk_impact: {
      other_risks: [
        "Notified clinicians are responsible for viewing full images per standard of care; notifications alone are not diagnostic.",
        "Intended only for use on non-enhanced head CT images; use on other modalities or protocols is out of scope.",
        "Use restricted to adults and transitional adolescents aged 18 or older; pediatric use is out of scope.",
        "Use is limited to scanners and acquisition protocols matching inclusion criteria (e.g., 64-slice or higher, slice thickness 0.625–5.0 mm).",
        "Technically inadequate scans (e.g., motion, severe metal artifacts, suboptimal field of view) may not be reliably analyzed."
      ]
    },
    overall_assessment: "Aidoc AI Monitoring team continuously monitors algorithm performance 24/7 to detect AI drift and emerging issues (e.g., alert correctness, data timeliness, completeness, slice thickness, series correctness, contrast phase, specificity, algorithmic positive ratio)."
  }
};

const aiTools = [
  {
    name: "Gleamer BoneView",
    version: "v2.4.1",
    riskLevel: "low",
    status: "active",
    lastValidation: "2025-12-01",
    drift: "normal",
    issues: 0,
    sites: 21,
    modelCard: modelCardData
  },
  {
    name: "Aidoc Brain CT",
    version: "v3.1.2",
    riskLevel: "medium",
    status: "active",
    lastValidation: "2025-11-28",
    drift: "minor",
    issues: 2,
    sites: 15,
    modelCard: modelCardData
  },
  {
    name: "Viz.ai Stroke",
    version: "v4.0.5",
    riskLevel: "low",
    status: "active",
    lastValidation: "2025-12-03",
    drift: "normal",
    issues: 0,
    sites: 18,
    modelCard: modelCardData
  },
  {
    name: "Arterys Cardiac",
    version: "v2.8.1",
    riskLevel: "high",
    status: "review",
    lastValidation: "2025-11-15",
    drift: "significant",
    issues: 5,
    sites: 8,
    modelCard: modelCardData
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
  const [selectedTool, setSelectedTool] = useState<typeof aiTools[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

  const handleViewDetails = (tool: typeof aiTools[0]) => {
    setSelectedTool(tool);
    setShowDetailsDialog(true);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Governance Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Monitor and manage AI tools across your organization
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handlePrintReport} className="flex-1 sm:flex-none">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Generate</span>
          </Button>
          <Button className="flex-1 sm:flex-none">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Configure</span>
            <span className="sm:hidden">Config</span>
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Last Validation</p>
                      <p className="font-medium text-xs sm:text-sm">{tool.lastValidation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Drift Status</p>
                      <Badge
                        variant="outline"
                        className={
                          tool.drift === "normal"
                            ? "text-green-600 border-green-600 text-xs"
                            : tool.drift === "minor"
                              ? "text-yellow-600 border-yellow-600 text-xs"
                              : "text-red-600 border-red-600 text-xs"
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
                    <div className="col-span-2 sm:col-span-1 sm:text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(tool)}
                        className="w-full sm:w-auto"
                      >
                        View Details
                      </Button>
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
                      <div className="h-2 w-24 sm:w-32 bg-muted rounded-full overflow-hidden">
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

      {/* Model Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl">
                {selectedTool?.name} - Model Card Details
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedTool && (
              <div className="space-y-6">
                {/* Metadata Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Metadata</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Model Name</p>
                      <p className="font-medium">{selectedTool.modelCard.metadata.model_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">{selectedTool.modelCard.metadata.model_version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vendor</p>
                      <p className="font-medium">{selectedTool.modelCard.metadata.vendor_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">PCCP Authorized</p>
                      <Badge variant={selectedTool.modelCard.metadata.pccp_authorized ? "default" : "destructive"}>
                        {selectedTool.modelCard.metadata.pccp_authorized ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">PCCP ID</p>
                      <p className="font-mono text-xs break-all">{selectedTool.modelCard.metadata.pccp_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Export Timestamp</p>
                      <p className="font-medium text-xs">{new Date(selectedTool.modelCard.metadata.export_timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Submission Numbers</p>
                      <p className="font-medium">{selectedTool.modelCard.metadata.submission_numbers.join(", ")}</p>
                    </div>
                  </div>
                </div>

                {/* Intended Use Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Intended Use</h3>
                  <p className="text-sm leading-relaxed">{selectedTool.modelCard.metadata.intended_use}</p>
                </div>

                {/* Performance Metrics Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Baseline Performance Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Sensitivity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold">
                              {(selectedTool.modelCard.impact_assessment.baseline_performance.metrics.sensitivity.value * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CI:</span>
                            <span className="font-medium text-xs">
                              [{(selectedTool.modelCard.impact_assessment.baseline_performance.metrics.sensitivity.ci[0] * 100).toFixed(2)}%, 
                              {(selectedTool.modelCard.impact_assessment.baseline_performance.metrics.sensitivity.ci[1] * 100).toFixed(2)}%]
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sample Size:</span>
                            <span className="font-medium">{selectedTool.modelCard.impact_assessment.baseline_performance.metrics.sensitivity.n}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Specificity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold">
                              {(selectedTool.modelCard.impact_assessment.baseline_performance.metrics.specificity.value * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CI:</span>
                            <span className="font-medium text-xs">
                              [{(selectedTool.modelCard.impact_assessment.baseline_performance.metrics.specificity.ci[0] * 100).toFixed(2)}%, 
                              {(selectedTool.modelCard.impact_assessment.baseline_performance.metrics.specificity.ci[1] * 100).toFixed(2)}%]
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sample Size:</span>
                            <span className="font-medium">{selectedTool.modelCard.impact_assessment.baseline_performance.metrics.specificity.n}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Risk Impact Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Risk Considerations</h3>
                  <div className="space-y-2">
                    {selectedTool.modelCard.impact_assessment.risk_impact.other_risks.map((risk, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                        <p>{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall Assessment Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Overall Assessment</h3>
                  <p className="text-sm leading-relaxed bg-muted p-4 rounded-lg">
                    {selectedTool.modelCard.impact_assessment.overall_assessment}
                  </p>
                </div>

                {/* FDA Metadata Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">FDA Metadata</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Primary Submission</p>
                      <p className="font-medium">{selectedTool.modelCard.metadata.fda_metadata.primary_submission}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">All Submissions</p>
                      <p className="font-medium">{selectedTool.modelCard.metadata?.fda_metadata?.all_submissions?.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
                <div className="rounded-full bg-green-100 dark:bg-green-950 p-1.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Validation completed</p>
                  <p className="text-xs text-muted-foreground truncate">Gleamer BoneView - Site A</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-950 p-1.5 shrink-0">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Drift detected</p>
                  <p className="text-xs text-muted-foreground truncate">Aidoc Brain CT - Performance</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-100 dark:bg-red-950 p-1.5 shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">High-priority issue</p>
                  <p className="text-xs text-muted-foreground truncate">Arterys Cardiac - Bias detected</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-1.5 shrink-0">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Performance improved</p>
                  <p className="text-xs text-muted-foreground truncate">Viz.ai Stroke - +3.2% sensitivity</p>
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
                  <div className="font-semibold mb-1 text-sm sm:text-base">Start Validation Run</div>
                  <div className="text-xs text-muted-foreground">
                    Initiate new validation for deployed models
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1 text-sm sm:text-base">Review Bias Radar</div>
                  <div className="text-xs text-muted-foreground">
                    Check fairness metrics across cohorts
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1 text-sm sm:text-base">Log Sentinel Event</div>
                  <div className="text-xs text-muted-foreground">
                    Report adverse events or near misses
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold mb-1 text-sm sm:text-base">View Transparency Reports</div>
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