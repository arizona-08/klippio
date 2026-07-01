import {IsEmail, IsEnum, IsString } from "class-validator";

export class InviteCollaboratorDto {
  @IsEmail()
  invitedEmail: string;

  @IsEnum(['VIEWER', 'EDITOR'])
  invitedRole: 'VIEWER' | 'EDITOR';

}