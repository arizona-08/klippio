export type MarkerPhotoType = {
  label: string;
  comment: string;
}

export class CreateMarkerDto {
  title: string;
  x: number;
  y: number;
  photosMetaData: MarkerPhotoType[];
}