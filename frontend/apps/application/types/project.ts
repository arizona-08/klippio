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