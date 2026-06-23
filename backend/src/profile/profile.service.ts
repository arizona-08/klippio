import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPersonalInfoDto } from './dtos/edit-personal-info.dto';
import { EditPasswordDto } from './dtos/edit-password.dto';
import * as bcrypt from 'bcryptjs';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';
import { EditUserPictureDto } from './dtos/edit-profile-picture.dto';
import { toPublicUser } from 'src/user/public-user';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly amazonS3Service: AmazonS3Service,
  ) {}

  async editPersonalInfo(userId: number, body: EditPersonalInfoDto) {
    const { email, firstname, lastname } = body;
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const emailInUse = await this.prismaService.user.findUnique({
      where: {
        email: email,
        NOT: {
          id: userId,
        },
      },
    });

    if (emailInUse) {
      throw new BadRequestException(
        "L'email est déjà utilisé par un autre utilisateur",
      );
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
        firstname,
        lastname,
      },
    });

    return {
      user: toPublicUser(updatedUser),
      success: true,
      message: 'Informations personnelles mises à jour avec succès',
    };
  }

  async editPasswordInfo(userId: number, body: EditPasswordDto) {
    const { currentPassword, newPassword, confirmationPassword } = body;
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new BadRequestException('Utilisateur introuvable');
      }

      if (newPassword !== confirmationPassword) {
        throw new BadRequestException('Les mots de passe ne correspondent pas');
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!passwordMatch) {
        throw new BadRequestException('Le mot de passe actuel est incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return {
        success: true,
        message: 'Mot de passe mis à jour avec succès',
      };
    } catch (error: unknown) {
      throw new BadRequestException(
        getErrorMessage(error, 'Erreur lors de la mise à jour du mot de passe'),
      );
    }
  }

  async editUserPicture(
    userId: number,
    file: Express.Multer.File,
    body: EditUserPictureDto,
  ) {
    const { zoom, offsetX, offsetY, type } = body;
    const parsedZoom = parseFloat(zoom as unknown as string);
    const parsedOffsetX = parseFloat(offsetX as unknown as string);
    const parsedOffsetY = parseFloat(offsetY as unknown as string);

    if (!file) {
      throw new BadRequestException('Aucun fichier téléchargé');
    }

    const { storageKey, temporaryAccessUrl } =
      await this.amazonS3Service.uploadImage({
        file: file,
        type: `USER_${type}_PICTURE`,
        userId: userId,
      });

    await this.prismaService.userPictures.upsert({
      where: {
        userId_type: {
          userId: userId,
          type: type,
        },
      },
      update: {
        storageKey: storageKey,
        zoom: parsedZoom,
        offsetX: parsedOffsetX,
        offsetY: parsedOffsetY,
      },
      create: {
        userId: userId,
        type: type,
        storageKey: storageKey,
        zoom: parsedZoom,
        offsetX: parsedOffsetX,
        offsetY: parsedOffsetY,
      },
    });

    const message =
      type === 'PROFILE'
        ? 'Photo de profil mise à jour avec succès'
        : 'Photo de bannière mise à jour avec succès';
    return {
      success: true,
      message: message,
      temporaryAccessUrl: temporaryAccessUrl,
    };
  }
}
