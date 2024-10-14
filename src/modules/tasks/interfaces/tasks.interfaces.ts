import { TaskEntity } from '../entities/task.entity';

export interface IProjectWithTasksForUser {
  project_id: number;
  project_name: string;
  tasks: Pick<
    TaskEntity,
    'id' | 'name' | 'status' | 'due_date' | 'done_at' | 'created_at'
  >[];
  total?: string;
}

export interface ITaskWithTotal extends TaskEntity {
  total?: string;
}
