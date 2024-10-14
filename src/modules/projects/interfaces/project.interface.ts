import { ProjectEntity } from '../entities/project.entity';

export interface IProjectWithTotal extends ProjectEntity {
  total?: string;
}
