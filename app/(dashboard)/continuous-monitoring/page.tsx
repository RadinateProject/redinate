"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Label
} from "recharts";
import {
  Download,
  AlertTriangle,
  CheckCircle2,
  Activity,
  TrendingUp,
  Badge
} from "lucide-react";
import CountAnimation from "@/components/ui/custom/count-animation";
import CustomDateRangePicker from "@/components/custom-date-range-picker";

const studiesData = [
  { month: "Nov 2024", studies: 85000 },
  { month: "Dec 2024", studies: 92000 },
  { month: "Jan 2025", studies: 98000 },
  { month: "Feb 2025", studies: 105000 },
  { month: "Mar 2025", studies: 110000 },
  { month: "Apr 2025", studies: 115000 },
  { month: "May 2025", studies: 120000 },
  { month: "Jun 2025", studies: 118000 },
  { month: "Jul 2025", studies: 125000 },
  { month: "Aug 2025", studies: 130000 },
  { month: "Sep 2025", studies: 135000 },
  { month: "Oct 2025", studies: 140000 }
];

const genderData = [
  { name: "Female", value: 55.4, fill: "#22c55e" },
  { name: "Male", value: 44.2, fill: "#3b82f6" },
  { name: "Non-binary", value: 0.4, fill: "#f59e0b" }
];

const ageData = [
  { name: "21-40", value: 23.9, fill: "#22c55e" },
  { name: "41-65", value: 44.3, fill: "#3b82f6" },
  { name: "65+", value: 28.7, fill: "#eab308" },
  { name: "<21", value: 3.1, fill: "#f97316" }
];

const ethnicityData = [
  { name: "Asian", value: 0.7, fill: "#22c55e" },
  { name: "Black", value: 2.7, fill: "#3b82f6" },
  { name: "Hispanic", value: 31.4, fill: "#eab308" },
  { name: "Other", value: 0.0, fill: "#f97316" },
  { name: "White", value: 65.2, fill: "#a855f7" }
];

const studyTypeData = [
  { name: "Foot", value: 18.4, fill: "#22c55e" },
  { name: "Hand", value: 18.0, fill: "#3b82f6" },
  { name: "Lower Ext.", value: 19.9, fill: "#eab308" },
  { name: "Spine Hip", value: 25.5, fill: "#f97316" },
  { name: "Unspecif.", value: 3.3, fill: "#a855f7" },
  { name: "Upper Ext.", value: 15.0, fill: "#ec4899" }
];

const agreementData = [
  { subject: "Age", mean: 85, variance: 75 },
  { subject: "Study Type", mean: 90, variance: 85 },
  { subject: "Ethnicity", mean: 70, variance: 60 },
  { subject: "Gender", mean: 95, variance: 88 },
  { subject: "Site", mean: 80, variance: 70 }
];

const sensitivityData = [
  { category: "21-40", sensitivity: 92, specificity: 95 },
  { category: "41-65", sensitivity: 87, specificity: 91 },
  { category: "65+", sensitivity: 91, specificity: 94 },
  { category: "<21", sensitivity: 88, specificity: 89 },
  { category: "Asian", sensitivity: 94, specificity: 96 },
  { category: "Black", sensitivity: 88, specificity: 91 },
  { category: "Hispanic", sensitivity: 86, specificity: 90 },
  { category: "Other", sensitivity: 87, specificity: 92 },
  { category: "White", sensitivity: 89, specificity: 93 }
];

const scatterData = [
  { ppv: 86.5, sensitivity: 94.7, category: "top" },
  { ppv: 86.8, sensitivity: 94.5, category: "top" },
  { ppv: 87.2, sensitivity: 94.4, category: "top" },
  { ppv: 87.5, sensitivity: 94.2, category: "top" },
  { ppv: 88.0, sensitivity: 94.0, category: "top" },
  { ppv: 88.5, sensitivity: 93.8, category: "top" },
  { ppv: 89.0, sensitivity: 93.5, category: "high" },
  { ppv: 89.5, sensitivity: 93.2, category: "high" },
  { ppv: 90.0, sensitivity: 92.9, category: "high" },
  { ppv: 90.5, sensitivity: 92.5, category: "high" },
  { ppv: 88.2, sensitivity: 84.5, category: "bottom" },
  { ppv: 88.5, sensitivity: 84.2, category: "bottom" },
  { ppv: 89.0, sensitivity: 84.0, category: "bottom" },
  { ppv: 89.5, sensitivity: 83.7, category: "bottom" }
];

const chartConfig = {
  studies: { label: "Studies", color: "#22c55e" },
  positive: { label: "Positive", color: "#3b82f6" },
  negative: { label: "Negative", color: "#f59e0b" }
};

export default function ContinuousMonitoring() {
  const [selectedCohort, setSelectedCohort] = useState("all-sites");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Continuous monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Gleamer BoneView - All Sites Selected (21)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-sites">All Sites Selected (21)</SelectItem>
              <SelectItem value="site-a">Site A</SelectItem>
              <SelectItem value="site-b">Site B</SelectItem>
              <SelectItem value="site-c">Site C</SelectItem>
            </SelectContent>
          </Select>
          <CustomDateRangePicker />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="grid divide-y-1! md:grid-cols-2 md:divide-x-1! lg:grid-cols-4 lg:divide-y-0! [&>*:nth-child(2)]:border-e-0! md:[&>*:nth-child(2)]:border-e-0! lg:[&>*:nth-child(2)]:border-e-1!">
          <Card className="hover:bg-muted rounded-none border-0 transition-colors">
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
              <CardTitle>Total Studies</CardTitle>
              <div className="absolute end-4 top-0 flex size-12 items-center justify-center rounded-full bg-blue-200 p-4 dark:bg-blue-950">
                <Activity className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="font-display text-3xl">
                <CountAnimation number={1487203} />
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="text-green-600">+12.3%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-muted rounded-none border-0 transition-colors">
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
              <CardTitle>Ground Truth Positive</CardTitle>
              <div className="absolute end-4 top-0 flex size-12 items-end justify-start rounded-full bg-green-200 p-4 dark:bg-green-950">
                <CheckCircle2 className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="font-display text-3xl">
                7%
              </div>
              <p className="text-muted-foreground text-xs">
                <CountAnimation number={104104} /> positive cases
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-muted rounded-none border-0 transition-colors">
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
              <CardTitle>Ground Truth Negative</CardTitle>
              <div className="absolute end-4 top-0 flex size-12 items-end justify-start rounded-full bg-purple-200 p-4 dark:bg-purple-950">
                <AlertTriangle className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="font-display text-3xl">
                93%
              </div>
              <p className="text-muted-foreground text-xs">
                <CountAnimation number={1383099} /> negative cases
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-muted rounded-none border-0 transition-colors">
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
              <CardTitle>Sites Monitored</CardTitle>
              <div className="absolute end-4 top-0 flex size-12 items-end justify-start rounded-full bg-orange-200 p-4 dark:bg-orange-950">
                <TrendingUp className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="font-display text-3xl">
                <CountAnimation number={21} />
              </div>
              <p className="text-muted-foreground text-xs">
                All sites selected
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg">Data Drift Detection</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Monitoring input distribution changes
              </p>
            </div>
            <Badge className="bg-green-500 w-fit">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Stable
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Age Distribution</p>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">0.02</p>
              <p className="text-xs text-muted-foreground">KL Divergence</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "5%" }} />
              </div>
            </div>

            <div className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Gender Distribution</p>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">0.01</p>
              <p className="text-xs text-muted-foreground">KL Divergence</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "3%" }} />
              </div>
            </div>

            <div className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Ethnicity Distribution</p>
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">0.08</p>
              <p className="text-xs text-muted-foreground">KL Divergence</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: "20%" }} />
              </div>
            </div>

            <div className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Study Type Distribution</p>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">0.03</p>
              <p className="text-xs text-muted-foreground">KL Divergence</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "8%" }} />
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs sm:text-sm">No Significant Drift</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All feature distributions remain within acceptable thresholds (KL  &lt; 0.05).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs sm:text-sm">Continuous Monitoring Active</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drift metrics updated hourly. Next check: 15:00 UTC
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm font-medium">Drift Threshold Legend</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Stable (&lt; 0.05)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Moderate (0.05-0.10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Critical (&gt; 0.10)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Studies Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={studiesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="studies"
                stroke="var(--color-studies)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Patient Population</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-1 items-center justify-center">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[200px] w-full">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5}>
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                  Gender
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="grid gap-2">
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground text-sm">Female</span>
                  </div>
                  <span className="text-sm font-medium">55.4%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground text-sm">Male</span>
                  </div>
                  <span className="text-sm font-medium">44.2%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground text-sm">Non-binary</span>
                  </div>
                  <span className="text-sm font-medium">0.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Age</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-1 items-center justify-center">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[200px] w-full">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={ageData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5}>
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                  Age
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="grid gap-2">
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground text-sm">21-40</span>
                  </div>
                  <span className="text-sm font-medium">23.9%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground text-sm">41-65</span>
                  </div>
                  <span className="text-sm font-medium">44.3%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground text-sm">65+</span>
                  </div>
                  <span className="text-sm font-medium">28.7%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground text-sm">&lt;21</span>
                  </div>
                  <span className="text-sm font-medium">3.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ethnicity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-1 items-center justify-center">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[200px] w-full">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={ethnicityData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5}>
                      {ethnicityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                  Ethnicity
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="grid gap-2">
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground text-sm">Asian</span>
                  </div>
                  <span className="text-sm font-medium">0.7%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground text-sm">Black</span>
                  </div>
                  <span className="text-sm font-medium">2.7%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground text-sm">Hispanic</span>
                  </div>
                  <span className="text-sm font-medium">31.4%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-purple-500" />
                    <span className="text-muted-foreground text-sm">White</span>
                  </div>
                  <span className="text-sm font-medium">65.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Study Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-1 items-center justify-center">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[200px] w-full">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={studyTypeData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5}>
                      {studyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                  Study
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="grid gap-2">
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground text-sm">Foot</span>
                  </div>
                  <span className="text-sm font-medium">18.4%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground text-sm">Spine/Hip</span>
                  </div>
                  <span className="text-sm font-medium">25.5%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground text-sm">Lower Ext.</span>
                  </div>
                  <span className="text-sm font-medium">19.9%</span>
                </div>
                <div className="bg-muted flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-pink-500" />
                    <span className="text-muted-foreground text-sm">Upper Ext.</span>
                  </div>
                  <span className="text-sm font-medium">15.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agreement Rate Across Cohorts</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Mean vs Variance</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Mean</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Variance</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <RadarChart data={agreementData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Mean" dataKey="mean" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Variance" dataKey="variance" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              </RadarChart>
            </ChartContainer>
            <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-950/30 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Strength</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gender shows exceptional consistency with the highest mean agreement (93%) and minimal variance (3%), indicating reliable model performance across all gender categories regardless of site or study conditions.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Potential Improvement</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Study Type exhibits the lowest mean agreement (69%) and highest variance (13%), suggesting inconsistent performance across different anatomical regions. This indicates a need for additional training data or model refinement in this area.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification Matrix</CardTitle>
            <p className="text-sm text-muted-foreground">Gleamer BoneView Performance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="col-span-1"></div>
                  <div className="col-span-1 font-semibold text-sm">Positive</div>
                  <div className="col-span-1 font-semibold text-sm">Negative</div>
                  <div className="col-span-1 font-semibold text-sm">Total</div>

                  <div className="col-span-1 font-semibold text-sm">Positive</div>
                  <div className="col-span-1 rounded bg-blue-100 dark:bg-blue-950 p-3">
                    <div className="text-xl font-bold">69,102</div>
                  </div>
                  <div className="col-span-1 rounded bg-gray-100 dark:bg-gray-800 p-3">
                    <div className="text-xl font-bold">9,400</div>
                  </div>
                  <div className="col-span-1 rounded bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="text-xl font-bold">77,902</div>
                  </div>

                  <div className="col-span-1 font-semibold text-sm">Negative</div>
                  <div className="col-span-1 rounded bg-gray-100 dark:bg-gray-800 p-3">
                    <div className="text-xl font-bold">62,170</div>
                  </div>
                  <div className="col-span-1 rounded bg-cyan-100 dark:bg-cyan-950 p-3">
                    <div className="text-xl font-bold text-cyan-600">1,086,836</div>
                  </div>
                  <div className="col-span-1 rounded bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="text-xl font-bold">1,070,300</div>
                  </div>

                  <div className="col-span-1 font-semibold text-sm">Total</div>
                  <div className="col-span-1 rounded bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="text-xl font-bold">131,302</div>
                  </div>
                  <div className="col-span-1 rounded bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="text-xl font-bold">1,010,400</div>
                  </div>
                  <div className="col-span-1 rounded bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="text-xl font-bold">1,147,700</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Sensitivity (Recall)</p>
                  <p className="text-2xl font-bold text-green-600">92.8%</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Specificity</p>
                  <p className="text-2xl font-bold text-blue-600">94.5%</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Precision (PPV)</p>
                  <p className="text-2xl font-bold text-purple-600">88.7%</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">NPV</p>
                  <p className="text-2xl font-bold text-cyan-600">96.1%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison Over Cohorts</CardTitle>
            <p className="text-sm text-muted-foreground">Sensitivity & Specificity by Demographics</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[400px]">
              <BarChart data={sensitivityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="category" width={80} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="sensitivity" fill="#22c55e" name="Sensitivity" radius={[0, 4, 4, 0]} />
                <Bar dataKey="specificity" fill="#3b82f6" name="Specificity" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top & Bottom Performing Sites</CardTitle>
              <Button variant="outline" size="sm">View Table</Button>
            </div>
            <p className="text-sm text-muted-foreground">Positive Predictive Value vs Sensitivity</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[400px]">
              <LineChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ppv" domain={[86, 91]} tick={{ fontSize: 12 }} label={{ value: "PPV (%)", position: "insideBottom", offset: -5 }} />
                <YAxis domain={[83, 95]} tick={{ fontSize: 12 }} label={{ value: "Sensitivity (%)", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  data={scatterData.filter(d => d.category === "top")}
                  dataKey="sensitivity"
                  stroke="#3b82f6"
                  strokeWidth={0}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  name="Top (90th)"
                />
                <Line
                  type="monotone"
                  data={scatterData.filter(d => d.category === "bottom")}
                  dataKey="sensitivity"
                  stroke="#ef4444"
                  strokeWidth={0}
                  dot={{ fill: "#ef4444", r: 5 }}
                  name="Low (50th)"
                />
                <Line
                  type="monotone"
                  data={scatterData.filter(d => d.category === "high")}
                  dataKey="sensitivity"
                  stroke="#22c55e"
                  strokeWidth={0}
                  dot={{ fill: "#22c55e", r: 5 }}
                  name="High (90th)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}