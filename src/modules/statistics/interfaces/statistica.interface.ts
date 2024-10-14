export interface IOrgsStatistics {
  organization_id: number;
  organization_name: string;
  project_count: number;
  task_count: number;
  total?: string;
}

interface IProjectInfo {
  project_id: number;
  project_name: string;
  task_count: number;
}

export interface IProjectStatistics {
  organization_id: number;
  organization_name: string;
  projects: IProjectInfo[];
}

export interface IGetAllCount {
  organizations_count: number;
  projects_count: number;
  tasks_count: number;
}
