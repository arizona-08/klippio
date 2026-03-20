import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Param, UseGuards, Body, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { PlanService } from './plan.service';

@UseGuards(AuthenticatedGuard) // Assure que seul un utilisateur connecté peut accéder à ce contrôleur
@Controller('/api/plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

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
    const uploadedPlanInfo = await this.planService.uploadPlan(fileName, projectId, userId, file);

    return {
      message: 'Fichier sauvegardé avec succès',
      uploadedPlan: uploadedPlanInfo,
    };
  }

  @Get(':planId')
  async getPlan(@Param('planId') planId: string) {
    return await this.planService.getPlan(planId);
  }

  @Get('last-opened/:projectId')
  async getLastOpenedPlan(@Param('projectId') projectId: string) {
    const lastPlan = await this.planService.getLastOpenedPlan(projectId);

    return {lastPlan};
  }
}