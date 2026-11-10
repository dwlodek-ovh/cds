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

export interface CDSWorkflow {
    name: string;
}
