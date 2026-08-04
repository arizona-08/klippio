export type ProjectType = {
  id: string;
  authorId: number;
  author?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  title: string;
  address: string;
  zipcode: string;
  city: string;
  thumbnailTemporaryAccessUrl: string | null;
  createdAt?: string;
  lastOpenedAt?: string;
  updatedAt?: string;
  isArchived?: boolean;

  numberOfPlans: number;
  numberOfPhotos: number;

  collaborators: CollaboratorType[];
  invitations: ProjectInvitationType[];
}

export type CollaboratorType = {
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    // invitationStatus?: 'pending' | 'accepted' | 'declined';
  }
}

export type ProjectPermissions = {
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  canView: boolean;
  canEdit: boolean;
};

export type NotificationType = 'INVITATION' | 'ROLE_CHANGED' | 'ACCESS_REMOVED' | 'CONTENT_MODERATION';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  projectId?: string | null;
  invitationToken?: string;
  createdAt: string;
  isRead: boolean;
};

export type ProjectInvitationType = {
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  email: string;
  createdAt: string;
}

export type ProjectInvitationDetailsType = ProjectInvitationType & {
  expiresAt: string;
  project: {
    id: string;
    title: string;
    address: string;
    city: string;
    zipcode: string;
    author: {
      firstname: string;
      lastname: string;
      email: string;
    };
  };
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
  markerNumber?: number,
  coordX: number,
  coordY: number,
  planId?: string,
  planPageNumber?: number,
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

export type MyStatsType = {
  markerStats: {
    totalMarkers: number;
    markersLastWeek: number;
  },
  photosStats: {
    totalPhotos: number;
    photosLastWeek: number;
  },
  projectsStats: {
    totalProjects: number;
    projectsLastWeek: number;
  },
  plansStats: {
    totalPlans: number;
    plansLastWeek: number;
  }
}

export type RecentActivityType = {
  id: string;
  activity: {
    id: string;
    createdAt: string;
    description: string;
  }
}

export type LastProjectOpenedType = {
  id: string;
  name: string;
  lastOpenedAt: string;
  project: {
    id: string;
    title: string;
  }
}
