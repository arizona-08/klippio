import { BadRequestException } from '@nestjs/common';

type UploadValidationOptions = {
  allowedMimeTypes: string[];
  maxSizeInBytes: number;
};

const MIME_SIGNATURES: Record<string, Array<(buffer: Buffer) => boolean>> = {
  'image/jpeg': [
    (buffer) => buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8,
  ],
  'image/png': [
    (buffer) =>
      buffer.length > 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47,
  ],
  'application/pdf': [
    (buffer) =>
      buffer.length > 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF',
  ],
};

export function validateUploadedFile(
  file: Express.Multer.File | undefined,
  options: UploadValidationOptions,
) {
  if (!file) {
    throw new BadRequestException('Aucun fichier téléchargé');
  }

  if (file.size > options.maxSizeInBytes) {
    throw new BadRequestException('Fichier trop volumineux');
  }

  if (!options.allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('Type de fichier non autorisé');
  }

  const validators = MIME_SIGNATURES[file.mimetype];
  if (!validators?.some((validator) => validator(file.buffer))) {
    throw new BadRequestException('Signature de fichier invalide');
  }
}

export function validateUploadedFiles(
  files: Express.Multer.File[] | undefined,
  options: UploadValidationOptions & { maxFiles: number },
) {
  if (!files || files.length === 0) {
    throw new BadRequestException('Aucun fichier téléchargé');
  }

  if (files.length > options.maxFiles) {
    throw new BadRequestException('Trop de fichiers téléchargés');
  }

  files.forEach((file) => validateUploadedFile(file, options));
}
