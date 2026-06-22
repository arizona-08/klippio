export type MarkerPhotoType = {
  label: string;
  comment: string;
};

export class CreateMarkerDto {
  title: string;
  coordX: number;
  coordY: number;
  photosMetaData: MarkerPhotoType[];
}
