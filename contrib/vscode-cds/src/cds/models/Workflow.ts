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
  steps: CdsWorkflowRunStep[];
}

export interface CDSWorkflow {
    name: string;
}
