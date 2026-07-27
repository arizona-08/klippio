import { validateUploadedFile, validateUploadedFiles } from './validate-upload';

const MAX_SIZE = 5_000_000;

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const WEBP_SIGNATURE = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
]);

const createFile = (
  mimetype: string,
  buffer: Buffer,
): Express.Multer.File =>
  ({
    fieldname: 'photos',
    originalname: 'file',
    encoding: '7bit',
    mimetype,
    size: buffer.length,
    buffer,
    destination: '',
    filename: '',
    path: '',
    stream: null,
  }) as unknown as Express.Multer.File;

describe('validate-upload', () => {
  describe('validateUploadedFile', () => {
    it('accepts a valid png file', () => {
      const file = createFile('image/png', Buffer.concat([PNG_SIGNATURE, Buffer.from([0x00, 0x01])]));

      expect(() =>
        validateUploadedFile(file, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInBytes: MAX_SIZE,
        }),
      ).not.toThrow();
    });

    it('accepts jpeg alias image/jpg', () => {
      const file = createFile('image/jpg', JPEG_SIGNATURE);

      expect(() =>
        validateUploadedFile(file, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInBytes: MAX_SIZE,
        }),
      ).not.toThrow();
    });

    it('accepts png bytes when declared mime is octet-stream', () => {
      const file = createFile(
        'application/octet-stream',
        Buffer.concat([PNG_SIGNATURE, Buffer.from([0x00, 0x01])]),
      );

      expect(() =>
        validateUploadedFile(file, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInBytes: MAX_SIZE,
        }),
      ).not.toThrow();
    });

    it('accepts when detected type is allowed despite declared mismatch', () => {
      const file = createFile('image/png', JPEG_SIGNATURE);

      expect(() =>
        validateUploadedFile(file, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInBytes: MAX_SIZE,
        }),
      ).not.toThrow();
    });

    it('rejects empty buffers', () => {
      const file = createFile('image/png', Buffer.alloc(0));

      expect(() =>
        validateUploadedFile(file, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInBytes: MAX_SIZE,
        }),
      ).toThrow('Signature de fichier invalide');
    });

    it('rejects unauthorized detected type even if declared as png', () => {
      const file = createFile('image/png', WEBP_SIGNATURE);

      expect(() =>
        validateUploadedFile(file, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInBytes: MAX_SIZE,
        }),
      ).toThrow('Type de fichier non autorisé');
    });
  });

  describe('validateUploadedFiles', () => {
    it('rejects when too many files are uploaded', () => {
      const files = [
        createFile('image/png', Buffer.concat([PNG_SIGNATURE, Buffer.from([0x00])])),
        createFile('image/png', Buffer.concat([PNG_SIGNATURE, Buffer.from([0x00])])),
      ];

      expect(() =>
        validateUploadedFiles(files, {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxFiles: 1,
          maxSizeInBytes: MAX_SIZE,
        }),
      ).toThrow('Trop de fichiers téléchargés');
    });
  });
});