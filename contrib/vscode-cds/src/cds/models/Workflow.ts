export interface CdsWorkflowRun {
  id: string;
  runNumber: number;
  status: string;
  started: string;
  workflowName: string;
  projectKey: string;
  username?: string;
  ref?: string;
  commit?: string;
  author?: string;
}

export interface CdsWorkflowRunStep {
  /** Display name of the step. */
  name: string;
  /** Identifier used to retrieve the step log. */
  logName: string;
  status?: string;
}

export interface CdsWorkflowRunJob {
  id: string;
  jobId: string;
  status: string;
  retry?: number;
  matrix?: Record<string, any>;
  gate?: string;
  steps: CdsWorkflowRunStep[];
}

export interface CdsWorkflowRunResultMetadata {
  type: string;
  value: string;
}

export interface CdsWorkflowRunResult {
  id: string;
  /** Result type, e.g. variable, generic, debian, tests. */
  type: string;
  /** "type:name", as returned by cdsctl. */
  name: string;
  label?: string;
  status?: string;
  detailType?: string;
  detail: Record<string, any>;
  metadata?: Record<string, CdsWorkflowRunResultMetadata>;
  artifactManagerMetadata?: Record<string, string>;
  artifactManagerIntegrationName?: string;
}

export interface CDSWorkflow {
    name: string;
}
