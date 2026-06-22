import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import {
  ForgotPasswordTokens,
  User,
  UserFilter,
} from './interfaces/user.interface';
import {
  CouldNotUpdateUserError,
  UserCreationError,
  UserNotFoundError,
} from 'src/Error/UserError';
import { err, ok, Result } from 'src/Error/Result';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private amazonS3Service: AmazonS3Service,
  ) {}

  async findAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser(
    createUserDto: CreateUserDTO,
  ): Promise<Result<User, UserCreationError>> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: await this.hashPassword(createUserDto.password),
        },
      });

      return ok<User>(createdUser);
    } catch (error: unknown) {
      return err(
        new UserCreationError(
          `Erreur lors de la création de l'utilisateur: ${getErrorMessage(error)}`,
        ),
      );
    }
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async findOneBy(
    filter: UserFilter,
    value: string | number,
  ): Promise<Result<User, UserNotFoundError>> {
    const user = await this.prisma.user.findFirst({
      where: {
        [filter]: value,
      },
      include: {
        userPictures: {
          select: {
            storageKey: true,
            zoom: true,
            offsetX: true,
            offsetY: true,
            type: true,
          },
        },
      },
    });

    if (!user)
      return err(
        new UserNotFoundError(
          `Utilisateur avec ${filter}: ${value} introuvable.`,
        ),
      );

    const presignedPictures = await Promise.all(
      user.userPictures.map(async (picture) => {
        if (!picture.storageKey) return null;
        const presignedUrl = await this.amazonS3Service.generatePresignedUrl(
          picture.storageKey,
          60 * 60,
        );
        return {
          url: presignedUrl,
          zoom: picture.zoom,
          offsetX: picture.offsetX,
          offsetY: picture.offsetY,
          type: picture.type,
        };
      }),
    );

    const userWithPresignedPictures: User = {
      ...user,
      profilePicture:
        presignedPictures.find((picture) => picture?.type === 'PROFILE') ||
        null,
      bannerPicture:
        presignedPictures.find((picture) => picture?.type === 'BANNER') || null,
    };

    return ok(userWithPresignedPictures);
  }

  async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<Result<User, UserNotFoundError | CouldNotUpdateUserError>> {
    const user = await this.findOneBy('id', id);
    if (!user.ok) return err(user.error); //user.error est de type UserNotFoundError

    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }

    if (updateData.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id }, // Exclude the current user from the check
        },
      });

      if (emailExists) {
        return err(
          new CouldNotUpdateUserError(
            'Email déja utilisé par un autre utilisateur.',
          ),
        );
      }
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return ok(updatedUser);
    } catch (error: unknown) {
      return err(
        new CouldNotUpdateUserError(
          `Erreur lors de la mise à jour de l'utilisateur: ${getErrorMessage(error)}`,
        ),
      );
    }
  }

  async deleteUser(id: number): Promise<Result<User, UserNotFoundError>> {
    const user = await this.findOneBy('id', id);
    if (!user.ok) return err(user.error);

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return ok(deletedUser);
  }

  async getForgotPasswordToken(
    forgotPasswordTokenSelector: string,
  ): Promise<Result<ForgotPasswordTokens, UserNotFoundError>> {
    const user = await this.findOneBy(
      'forgotPasswordTokenSelector',
      forgotPasswordTokenSelector,
    );
    if (!user.ok) {
      return err(user.error);
    }

    return ok({
      userId: user.value.id,
      forgotPasswordTokenSelector: user.value.forgotPasswordTokenSelector,
      forgotPasswordToken: user.value.forgotPasswordToken,
      forgotPasswordTokenExpiry: user.value.forgotPasswordTokenExpiry,
    });
  }
}
