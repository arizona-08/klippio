export class UpdateMarkerDto {
  title: string;
  coordX: number;
  coordY: number;

  existingPhotosToUpdate: {
    identifier: string;
    label: string;
    comment: string;
  }[];

  newPhotosMetadata: {
    label: string;
    comment: string;
  }[];

  deletedPhotoIdentifiers: string[];


}
