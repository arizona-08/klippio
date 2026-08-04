import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly amazonS3: AmazonS3Service,
  ) {}

  async create(photoId: string, reporterId: number, reason?: string) {
    const photo = await this.prisma.markerPhoto.findFirst({
      where: {
        id: photoId,
        marker: {
          plan: {
            project: {
              OR: [
                { authorId: reporterId },
                { projectCollaborators: { some: { userId: reporterId } } },
              ],
            },
          },
        },
      },
      select: { id: true },
    });

    if (!photo) throw new NotFoundException('Photo introuvable.');

    try {
      return await this.prisma.photoReport.create({
        data: { photoId, reporterId, reason: reason?.trim() || null },
      });
    } catch (error: unknown) {
      if (this.isDuplicateReport(error)) {
        throw new BadRequestException('Vous avez déjà signalé cette photo.');
      }
      throw error;
    }
  }

  async findAll() {
    const reports = await this.prisma.photoReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
        photo: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                isBanned: true,
              },
            },
            marker: {
              include: {
                plan: {
                  include: { project: { select: { id: true, title: true } } },
                },
              },
            },
          },
        },
      },
    });

    return Promise.all(
      reports.map(async (report) => ({
        ...report,
        photo: {
          ...report.photo,
          temporaryAccessUrl: await this.amazonS3.generatePresignedUrl(
            report.photo.photoStorageKey,
            3600,
          ),
        },
      })),
    );
  }

  async removePhotoAndNotifyUploader(reportId: string) {
    const report = await this.prisma.photoReport.findUnique({
      where: { id: reportId },
      include: {
        photo: {
          select: { id: true, photoStorageKey: true, uploadedById: true },
        },
      },
    });
    if (!report) throw new NotFoundException('Signalement introuvable.');
    if (!report.photo.uploadedById) {
      throw new BadRequestException('L’auteur de cette photo est inconnu.');
    }

    await this.removePhoto(report.photo.id, report.photo.photoStorageKey);
    await this.prisma.notification.create({
      data: {
        userId: report.photo.uploadedById,
        type: 'CONTENT_MODERATION',
        title: 'Photo supprimée',
        message:
          'Votre photo a été supprimée car elle ne respecte pas les règles de contenu de la plateforme Klippio. Merci de veiller à publier uniquement des contenus appropriés et professionnels.',
      },
    });
    return { message: 'Photo supprimée et avertissement envoyé.' };
  }

  async removePhotoAndBanUploader(reportId: string, adminId: number) {
    const report = await this.prisma.photoReport.findUnique({
      where: { id: reportId },
      include: {
        photo: {
          select: { id: true, photoStorageKey: true, uploadedById: true },
        },
      },
    });
    if (!report) throw new NotFoundException('Signalement introuvable.');
    if (!report.photo.uploadedById) {
      throw new BadRequestException('L’auteur de cette photo est inconnu.');
    }
    if (report.photo.uploadedById === adminId) {
      throw new BadRequestException(
        'Vous ne pouvez pas suspendre votre propre compte.',
      );
    }

    await this.removePhoto(report.photo.id, report.photo.photoStorageKey);
    await this.prisma.user.update({
      where: { id: report.photo.uploadedById },
      data: { isBanned: true },
    });
    return { message: 'Photo supprimée et utilisateur suspendu avec succès.' };
  }

  private async removePhoto(photoId: string, storageKey: string) {
    await this.amazonS3.deleteImage(storageKey);
    await this.prisma.markerPhoto.delete({ where: { id: photoId } });
  }

  private isDuplicateReport(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
