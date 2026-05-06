import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditPersonalInfoDto } from "./dtos/edit-personal-info.dto";
import { EditPasswordDto } from "./dtos/edit-password.dto";
import { BlockedEncryptionTypes$ } from "@aws-sdk/client-s3";
import bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async editPersonalInfo(userId: number, body: EditPersonalInfoDto) {
    const { email, firstname, lastname } = body;
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new BadRequestException("Utilisateur introuvable");
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
      throw new BadRequestException("L'email est déjà utilisé par un autre utilisateur");
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

    const { password, ...result } = updatedUser;

    return {
      user: result,
      success: true,
      message: "Informations personnelles mises à jour avec succès",
    };
  }

  async editPasswordInfo(userId: number, body: EditPasswordDto) {
    const { currentPassword, newPassword, confirmationPassword } = body;
    try{
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new BadRequestException("Utilisateur introuvable");
      }

      if (newPassword !== confirmationPassword) {
        throw new BadRequestException("Les mots de passe ne correspondent pas");
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        throw new BadRequestException("Le mot de passe actuel est incorrect");
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
        message: "Mot de passe mis à jour avec succès",
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || "Erreur lors de la mise à jour du mot de passe");
    }
  }
}