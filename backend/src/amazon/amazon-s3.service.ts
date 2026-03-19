import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
  async uploadImage(fileBuffer: Buffer, originalFileName: string, fileMimeType: string): Promise<string> {
    const bucketName = this.configurationService.getOrThrow<string>('AMAZON_S3_BUCKET_NAME');
    
    // Génération d'un nom unique pour éviter d'écraser des fichiers existants
    const uniqueTimestamp = Date.now().toString();
    const fileExtension = originalFileName.split('.').pop();
    const generatedFileName = `${uniqueTimestamp}-${originalFileName}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: generatedFileName,
      Body: fileBuffer,
      ContentType: fileMimeType,
      // Optionnel : 'public-read' si ton bucket autorise la lecture publique des images
      // ACL: 'public-read', 
    });

    try {
      await this.amazonClient.send(uploadCommand);
      
      // Construction et retour de l'URL publique de l'image
      const regionName = await this.amazonClient.config.region();
      const publicUrl = `https://${bucketName}.s3.${regionName}.amazonaws.com/${generatedFileName}`;
      
      return publicUrl;
    } catch (uploadError) {
      this.loggerInstance.error('Échec lors de l\'envoi de l\'image sur Amazon S3', uploadError);
      throw uploadError;
    }
  }

  // Dans ton service AmazonSimpleStorageService

  async generateStorageKey(
    userIdentifier: string, 
    projectIdentifier: string, 
    fileCategory: 'plans' | 'photos-marqueurs', 
    originalFileName: string
  ) {
    
    const uniqueTimestamp = Date.now().toString();
    // On nettoie le nom du fichier pour éviter les espaces et caractères spéciaux
    const cleanFileName = originalFileName.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    
    // Construction de la clé complète sans aucune abréviation
    const storageKey = `${userIdentifier}/${projectIdentifier}/${fileCategory}/${uniqueTimestamp}-${cleanFileName}`;
    
    return storageKey;
  }
}