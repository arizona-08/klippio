export type ProjectType = {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  city: string;
  thumbnailUrl: string;

  numberOfPlans: number;
  numberOfPhotos: number;

  collaborators: CollaboratorType[];
}

export type CollaboratorType = {
  firstname: string;
  lastname: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  invitationStatus?: 'pending' | 'accepted' | 'declined';
}

export type PlanType = {
  name: string;
  file: File;
}

export type FileType = {
  id: string;
  parentId?: string;
  type: 'file';
  name: string;
  lastModified: Date;
}

export type FolderType = {
  id: string;
  parentId?: string;
  type: 'folder' | 'root';
  name: string;
  lastModified: Date;
  children?: Array<FolderType | FileType>;
}