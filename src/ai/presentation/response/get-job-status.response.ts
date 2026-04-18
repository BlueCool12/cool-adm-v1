import { AiTaskStatus } from '@/ai/domain/ai-task-status.enum';
import { AiTaskResult } from '@/ai/domain/ai-task-result.interface';

export class GetJobStatusResponse {
  readonly status: AiTaskStatus;
  readonly result?: unknown;
  readonly error?: string;
  readonly createdAt: number;

  private constructor(status: AiTaskStatus, createdAt: number, result?: unknown, error?: string) {
    this.status = status;
    this.createdAt = createdAt;
    this.result = result;
    this.error = error;
  }

  static from(task: AiTaskResult): GetJobStatusResponse {
    return new GetJobStatusResponse(task.status, task.createdAt, task.result, task.error);
  }
}
