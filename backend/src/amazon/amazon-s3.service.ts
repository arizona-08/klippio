import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PicUpload } from "./types/pic-upload";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AmazonS3Service {
  private readonly amazonClient: S3Client;
  private readonly loggerInstance = new Logger(AmazonS3Service.name);

  constructor(private readonly configurationService: ConfigService, private readonly prismaService: PrismaService) {
    // Initialisation du client Amazon avec les identifiants sécurisés
    this.amazonClient = new S3Client({
      region: this.configurationService.getOrThrow<string>('AMAZON_S3_REGION'),
      credentials: {
        accessKeyId: this.configurationService.getOrThrow<string>('AMAZON_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configurationService.getOrThrow<string>('AMAZON_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Envoie un fichier vers le bucket Amazon S3
   */
  async uploadImage({ type, file, userId, projectId, markerId }: PicUpload): Promise<{fileUrl: string, generatedFileName: string}> {
    const bucketName = this.configurationService.getOrThrow<string>('AMAZON_S3_BUCKET_NAME');
    
    // Génération d'un nom unique pour éviter d'écraser des fichiers existants
    const uniqueTimestamp = Date.now().toString();
    const fileExtension = file.originalname.split('.').pop();
    const generatedFileName = `${uniqueTimestamp}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase()}`;

    

    
    let storageKey = `client-${userId}`;

    if(type === "PLAN") {
      storageKey += `/project-${projectId}/plans/${generatedFileName}`;
    }

    if(type === "MARKER_PICTURE") {
      storageKey += `/project-${projectId}/markers/${markerId}/${generatedFileName}`;
    }

    if(type === "PROJECT_THUMBNAIL") {
      storageKey += `/thumbnail/${generatedFileName}`;
    }

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Optionnel : 'public-read' si ton bucket autorise la lecture publique des images
      // ACL: 'public-read', 
    });

    try {
      await this.amazonClient.send(uploadCommand);
      const regionName = await this.amazonClient.config.region();

      const fileUrl = `https://${bucketName}.s3.${regionName}.amazonaws.com/${storageKey}`;
      return { fileUrl, generatedFileName };
    } catch (uploadError) {
      this.loggerInstance.error("Échec lors de l'envoi de l'image sur Amazon S3", uploadError);
      throw uploadError;
    }
  }

  async  uploadPlan(name: string, projectId: string, userId: number, file: Express.Multer.File) {
    const { fileUrl } = await this.uploadImage({
      type: "PLAN",
      file,
      userId,
      projectId,
    });


    try {
      const insertedPlan = await this.prismaService.plan.create({
        data: {
          projectId,
          documentStoragKey: fileUrl,
          name,
        },
      });

      return insertedPlan;
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de l'enregistrement du plan en base de données");
    }
  }
}