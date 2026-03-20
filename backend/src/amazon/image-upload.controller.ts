import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Param, UseGuards, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AmazonS3Service } from './amazon-s3.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@UseGuards(AuthenticatedGuard) // Assure que seul un utilisateur connecté peut accéder à ce contrôleur
@Controller('/api/images')
export class ImageUploadController {
  constructor(private readonly amazonS3Service: AmazonS3Service) {}

  @Post('upload-plan/:projectId')
  @UseInterceptors(FileInterceptor('file')) // 'imageFile' est le nom du champ dans le FormData côté Next.js
  async uploadPlan(
    @UploadedFile(
      // Sécurité : On valide le type et la taille du fichier avant de l'envoyer à Amazon
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // Limite à 5 Mégaoctets
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }), // Accepte images et PDF
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('projectId') projectId: string,
    @Body() body :any,
    @CurrentUser() user: User,
  ) {
    
    const userId = user.id;
    const fileName = body.name;
    const uploadedPlanInfo = await this.amazonS3Service.uploadPlan(fileName, projectId, userId, file);

    return {
      message: 'Fichier sauvegardé avec succès',
      fileUrl: uploadedPlanInfo.documentStoragKey,
    };
  }
}