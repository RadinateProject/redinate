import { apiService, ApiResponse } from './ApiService';

// --- Type Definitions ---

export interface PatientDetails {
    age: number;
    sex: 'Male' | 'Female' | string;
    state?: string;
}

export interface ClaimDetails {
    claim_id: string;
    patient_id: string;
    total_charge_amount: number;
    diagnosis_code: string; // Expected format: ^[A-Z][0-9]+
    procedure_code: string;
}

export interface ClaimRequest {
    claim_details: ClaimDetails;
    patient_details: PatientDetails;
}

export type PredictionDecision = 'APPROVED' | 'DENIED' | 'Human Review Required';

export interface PredictionResult {
    claim_id: string;
    confidence_score: number;
    decision: PredictionDecision;
    transaction_id: string;
    reason?: string;
    compliance_mode?: string;
}

export interface DriftReport {
    overall_status: 'STABLE' | 'DRIFT DETECTED';
    details: Record<string, any>;
}

export class PredictionService {

    /**
     * Predict Claim
     * Submits a claim for AI evaluation and governance check.
     */
    async predictClaim(data: ClaimRequest): Promise<ApiResponse<PredictionResult>> {
        return apiService.post<PredictionResult>('/predict', data);
    }

    /**
     * Audit Data Drift
     * Sends recent logs to verify if the model performance might be degrading.
     */
    async auditDrift(logs: Record<string, any>[]): Promise<ApiResponse<DriftReport>> {
        return apiService.post<DriftReport>('/audit', { recent_logs: logs });
    }

    /**
     * Reset System (Circuit Breaker)
     * Manually resets the circuit breaker if it was tripped by bias or drift.
     */
    async resetSystem(): Promise<ApiResponse<{ status: string; message: string }>> {
        return apiService.post('/reset');
    }

    /**
     * Download Compliance Report
     * Fetches the generated PDF audit report from the backend.
     */
    async downloadReport(): Promise<void> {
        const response = await apiService.post<Blob>('/report');

        if (response.success && response.data) {
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            console.error("Failed to download report:", response.error);
            throw new Error(response.error || "Report generation failed");
        }
    }
}

export const predictionService = new PredictionService();
