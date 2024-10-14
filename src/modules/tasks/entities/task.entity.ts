import { TASK_STATUS } from '../enums/task-status.enum';

export interface TaskEntity {
  id: number;
  name: string;
  created_by: number;
  project_id: number;
  due_date?: string;
  worker_user_id?: number;
  status: TASK_STATUS;
  done_at?: string;
  is_deleted: boolean;
  created_at: string;
}
