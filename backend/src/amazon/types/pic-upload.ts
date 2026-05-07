export type PicUpload = {
  type: "PLAN" | "MARKER_PICTURE" | "PROJECT_THUMBNAIL" | "USER_PROFILE_PICTURE" | "USER_BANNER_PICTURE";
  file: Express.Multer.File;
  userId: number;
  projectId?: string;
  markerId?: string; // Optionnel, uniquement pour les photos de marqueurs
  
}