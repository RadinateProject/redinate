"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const riskCardData = {
  metadata: {
    model_id: "acorn-3d-software-k234009",
    model_name: "Acorn 3D Software (AC-SEG-4009); Acorn 3DP Model (AC-101-XX)",
    model_version: "ICH-02-RT",
    vendor_name: "Mighty Oak Medical",
    pccp_id: "pccp-acorn-3d-software-k234009-20251203T135510.739364Z",
    export_timestamp: "2025-12-03T13:55:10.739364Z",
    pccp_authorized: true,
    submission_numbers: ["K234009"]
  },
  baseline_performance: {
    sensitivity: { value: 0.9615, ci: [0.9044, 0.9894], n: 220 },
    specificity: { value: 0.9483, ci: [0.8908, 0.9808], n: 220 }
  },
  other_risks: [
    "Notified clinicians are responsible for viewing full images per standard of care; notifications alone are not diagnostic.",
    "Intended only for use on non-enhanced head CT images; use on other modalities or protocols is out of scope.",
    "Use restricted to adults and transitional adolescents aged 18 or older; pediatric use is out of scope.",
    "Use is limited to scanners and acquisition protocols matching inclusion criteria (e.g., 64-slice or higher, slice thickness 0.625–5.0 mm).",
    "Technically inadequate scans (e.g., motion, severe metal artifacts, suboptimal field of view) may not be reliably analyzed."
  ],
  intended_use: "Radiological computer-aided triage and notification software indicated for use in the analysis of non-enhanced head CT images in adults aged 18 and older, to assist hospital networks and appropriately trained medical specialists in workflow triage by flagging and communicating suspected positive findings of intracranial hemorrhage (ICH) pathologies."
};

export default function RiskCardApplied() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Risk Card - Applied</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
            {riskCardData.metadata.model_name}
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-base sm:text-lg">Model Information</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Regulatory and identification details
                </p>
              </div>
              <div className="flex items-center gap-2">
                {riskCardData.metadata.pccp_authorized ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    PCCP Authorized
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Not Authorized
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Model ID</p>
                <p className="text-sm font-medium break-all">{riskCardData.metadata.model_id}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Version</p>
                <p className="text-sm font-medium">{riskCardData.metadata.model_version}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Vendor</p>
                <p className="text-sm font-medium">{riskCardData.metadata.vendor_name}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Submission Number</p>
                <p className="text-sm font-medium">{riskCardData.metadata.submission_numbers[0]}</p>
              </div>
            </div>

            <div className="rounded-lg border p-3 sm:p-4">
              <p className="text-xs text-muted-foreground mb-1">PCCP ID</p>
              <p className="text-xs sm:text-sm font-mono break-all">{riskCardData.metadata.pccp_id}</p>
            </div>

            <div className="rounded-lg border p-3 sm:p-4">
              <p className="text-xs text-muted-foreground mb-1">Export Timestamp</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(riskCardData.metadata.export_timestamp).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Performance Metrics</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">Baseline validation results</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Sensitivity</p>
                <Badge variant="outline" className="text-xs">n = {riskCardData.baseline_performance.sensitivity.n}</Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {(riskCardData.baseline_performance.sensitivity.value * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                95% CI: [{(riskCardData.baseline_performance.sensitivity.ci[0] * 100).toFixed(2)}%, {(riskCardData.baseline_performance.sensitivity.ci[1] * 100).toFixed(2)}%]
              </p>
            </div>

            <div className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Specificity</p>
                <Badge variant="outline" className="text-xs">n = {riskCardData.baseline_performance.specificity.n}</Badge>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {(riskCardData.baseline_performance.specificity.value * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                95% CI: [{(riskCardData.baseline_performance.specificity.ci[0] * 100).toFixed(2)}%, {(riskCardData.baseline_performance.specificity.ci[1] * 100).toFixed(2)}%]
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Intended Use</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">Clinical application and scope</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 sm:p-4">
            <p className="text-xs sm:text-sm leading-relaxed">{riskCardData.intended_use}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-base sm:text-lg">Risk Factors & Limitations</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Important considerations for clinical use
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskCardData.other_risks.map((risk, idx) => (
              <div key={idx} className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/30 p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm flex-1">{risk}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Application History</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">Recent deployment and usage</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Initial Deployment</p>
                  <p className="text-xs text-muted-foreground">Applied to production environment</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs w-fit">Dec 3, 2025</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Validation Completed</p>
                  <p className="text-xs text-muted-foreground">All acceptance criteria met</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs w-fit">Dec 1, 2025</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Monitoring Active</p>
                  <p className="text-xs text-muted-foreground">Continuous performance tracking enabled</p>
                </div>
              </div>
              <Badge className="bg-blue-500 text-xs w-fit">Ongoing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 