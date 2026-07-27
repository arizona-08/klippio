import { BadRequestException, Logger } from '@nestjs/common';

type UploadValidationOptions = {
  allowedMimeTypes: string[];
  maxSizeInBytes: number;
};

const logger = new Logger('UploadValidation');

const MIME_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
  'image/apng': 'image/png',
};

const normalizeMimeType = (mimeType: string | undefined): string => {
  if (!mimeType) {
    return '';
  }

  const normalized = mimeType.toLowerCase();
  return MIME_ALIASES[normalized] ?? normalized;
};

const bytesToHexPreview = (buffer: Buffer, bytes = 16): string =>
  buffer
    .subarray(0, Math.min(bytes, buffer.length))
    .toString('hex')
    .match(/.{1,2}/g)
    ?.join(' ') ?? '';

const MIME_SIGNATURES: Record<string, Array<(buffer: Buffer) => boolean>> = {
  'image/jpeg': [
    (buffer) => buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8,
  ],
  'image/png': [
    (buffer) =>
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a,
  ],
  'application/pdf': [
    (buffer) =>
      buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF',
  ],
  'image/webp': [
    (buffer) =>
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  ],
};

const detectMimeTypeFromBuffer = (buffer: Buffer): string | undefined => {
  for (const [mimeType, validators] of Object.entries(MIME_SIGNATURES)) {
    if (validators.some((validator) => validator(buffer))) {
      return mimeType;
    }
  }

  return undefined;
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

  const declaredMimeType = normalizeMimeType(file.mimetype);
  const allowedMimeTypes = new Set(
    options.allowedMimeTypes.map(normalizeMimeType),
  );

  if (!file.buffer || file.buffer.length === 0) {
    logger.warn(
      `Upload rejected: empty buffer (declared=${declaredMimeType || 'unknown'})`,
    );
    throw new BadRequestException('Signature de fichier invalide');
  }

  const detectedMimeType = detectMimeTypeFromBuffer(file.buffer);

  // Prefer binary signature over declared MIME to handle browser/client quirks.
  if (detectedMimeType && allowedMimeTypes.has(detectedMimeType)) {
    return;
  }

  if (!detectedMimeType && declaredMimeType && allowedMimeTypes.has(declaredMimeType)) {
    const validators = MIME_SIGNATURES[declaredMimeType];
    if (validators?.some((validator) => validator(file.buffer))) {
      return;
    }
  }

  if (
    (detectedMimeType && !allowedMimeTypes.has(detectedMimeType)) ||
    (!detectedMimeType && !allowedMimeTypes.has(declaredMimeType))
  ) {
    logger.warn(
      `Upload rejected: unauthorized type (declared=${declaredMimeType || 'unknown'}, detected=${detectedMimeType || 'unknown'}, firstBytes=${bytesToHexPreview(file.buffer)})`,
    );
    throw new BadRequestException('Type de fichier non autorisé');
  }

  logger.warn(
    `Upload rejected: invalid signature (declared=${declaredMimeType || 'unknown'}, detected=${detectedMimeType || 'unknown'}, firstBytes=${bytesToHexPreview(file.buffer)})`,
  );
  throw new BadRequestException('Signature de fichier invalide');
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
