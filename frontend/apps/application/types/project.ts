export type ProjectType = {
  id: string;
  title: string;
  address: string;
  zipcode: string;
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

export type PlanTypeDto = {
  name: string;
  file: File;
}

export type CurrentPlanType = {
  id: string;
  name: string;
  storageKey: string;
  temporaryAccessUrl: string;
  isPdfDocument: boolean;
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

export type MarkerType = {
  id: number,
  x: number,
  y: number,
  title: string,
  photos: MarkerPhotoType[]
}

export type MarkerPhotoType = {
  label: string
  comment: string
  photoUrl: string | ArrayBuffer | null
}