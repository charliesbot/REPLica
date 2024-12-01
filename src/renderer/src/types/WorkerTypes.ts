export interface WorkerMessage {
  id: string;
  code: string;
}

export interface WorkerResponse {
  id: string;
  success: boolean;
  results?: string[];
  error?: string;
}
