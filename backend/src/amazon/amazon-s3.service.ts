import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PicUpload } from "./types/pic-upload";

@Injectable()
export class AmazonS3Service {
  private readonly amazonClient: S3Client;
  private readonly loggerInstance = new Logger(AmazonS3Service.name);

  constructor(private readonly configurationService: ConfigService) {
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
  async uploadImage({ type, file, userId, projectId, markerId }: PicUpload): Promise<{storageKey: string, generatedFileName: string, temporaryAccessUrl: string}> {
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

    if(type === "USER_PROFILE_PICTURE") {
      storageKey += `/profile/${generatedFileName}`;
    }

    if(type === "USER_BANNER_PICTURE") {
      storageKey += `/banner/${generatedFileName}`;
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
      const temporaryAccessUrl = await this.generatePresignedUrl(storageKey, 3600);

      // const fileUrl = `https://${bucketName}.s3.${regionName}.amazonaws.com/${storageKey}`;
      return { storageKey, generatedFileName, temporaryAccessUrl };
    } catch (uploadError) {
      this.loggerInstance.error("Échec lors de l'envoi de l'image sur Amazon S3", uploadError);
      throw uploadError;
    }
  }

  async generatePresignedUrl(storageKey: string, expirationInSeconds: number = 900): Promise<string> {
    const bucketName = this.configurationService.getOrThrow<string>('AMAZON_S3_BUCKET_NAME');

    // On prépare la commande de lecture
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
    });

    try {
      // Le client Amazon va signer la requête avec tes clés secrètes
      // Le paramètre expiresIn définit la durée de validité (ici 900 secondes = 15 minutes)
      const temporaryAccessUrl = await getSignedUrl(
        this.amazonClient, 
        getObjectCommand, 
        { expiresIn: expirationInSeconds }
      );
      
      return temporaryAccessUrl;
    } catch (signatureError) {
      this.loggerInstance.error("Erreur lors de la génération de l'URL présignée", signatureError);
      throw new InternalServerErrorException("Impossible de générer l'accès au fichier sécurisé");
    }
  }

  async deleteImage(storageKey: string) {
    const bucketName = this.configurationService.getOrThrow<string>('AMAZON_S3_BUCKET_NAME');

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
    });

    try {
      await this.amazonClient.send(deleteCommand);
    } catch (deleteError) {
      this.loggerInstance.error("Erreur lors de la suppression de l'image sur Amazon S3", deleteError);
      throw new InternalServerErrorException("Impossible de supprimer le fichier sur Amazon S3");
    }
  }
}