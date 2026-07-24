import { IsIn } from 'class-validator';

export class UpdateCollaboratorRoleDto {
  @IsIn(['VIEWER', 'EDITOR'])
  role: 'VIEWER' | 'EDITOR';
}
