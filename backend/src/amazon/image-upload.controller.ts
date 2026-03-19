import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AmazonS3Service } from './amazon-s3.service';


@Controller('/api/images')
export class ImageUploadController {
  constructor(private readonly amazonS3Service: AmazonS3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('imageFile')) // 'imageFile' est le nom du champ dans le FormData côté Next.js
  async uploadImageEndpoint(
    @UploadedFile(
      // Sécurité : On valide le type et la taille du fichier avant de l'envoyer à Amazon
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // Limite à 5 Mégaoctets
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }), // Accepte images et PDF
        ],
      }),
    )
    uploadedFile: Express.Multer.File,
    @Req() request: any,
  ) {
    
    const publicImageUrl = await this.amazonS3Service.uploadImage(
      uploadedFile.buffer,
      uploadedFile.originalname,
      uploadedFile.mimetype,
    );

    return {
      message: 'Fichier sauvegardé avec succès',
      fileUrl: publicImageUrl,
    };
  }

  
}