import {IsEmail, IsEnum, IsString } from "class-validator";

export class InviteCollaboratorDto {
  @IsString()
  projectId: string;

  @IsEmail()
  invitedEmail: string;

  @IsEnum(['VIEWER', 'EDITOR'])
  invitedRole: 'VIEWER' | 'EDITOR';

}