type ProfilePicturePosition = {
  zoom?: number | null;
  offsetX?: number | null;
  offsetY?: number | null;
};

// Les offsets sont enregistrés dans le repère de l'éditeur d'avatar (240 px).
const PROFILE_PICTURE_EDITOR_SIZE = 240;

export function getProfilePictureTransform(
  picture: ProfilePicturePosition | null | undefined,
  displaySize: number,
) {
  const offsetScale = displaySize / PROFILE_PICTURE_EDITOR_SIZE;
  const zoom = picture?.zoom ?? 1;
  const offsetX = (picture?.offsetX ?? 0) * offsetScale;
  const offsetY = (picture?.offsetY ?? 0) * offsetScale;

  return `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
}
