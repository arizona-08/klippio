export type ProjectType = {
  id: string;
  title: string;
  address: string;
  zipcode: string;
  city: string;
  thumbnailUrl: string;
  createdAt?: string;
  lastOpenedAt?: string;
  updatedAt?: string;
  isArchived?: boolean;

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

export type PlanType = {
  id: string;
  name: string;
  storageKey: string;
  temporaryAccessUrl: string;
  lastOpenedAt: string;
  folderId: string;

  markers: MarkerType[];
}


export type FolderType = {
  id: string;
  parentId?: string;
  isRoot: boolean;
  name: string;
  lastModifiedAt: string;
  subfolders: FolderType[];
  plans: PlanType[];
}

export type MarkerType = {
  id?: string,
  coordX: number,
  coordY: number,
  title: string,
  photos: MarkerPhotoType[]
}

export type MarkerPhotoType = {
  id?: string
  label: string
  comment: string
  previewUrl: string | ArrayBuffer | null
  physicalFile: File
  temporaryAccessUrl?: string
}