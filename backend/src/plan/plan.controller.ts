import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  UseGuards,
  Body,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { PlanService } from './plan.service';
import { validateUploadedFile } from 'src/uploads/validate-upload';
import { UploadPlanBodyDto } from './dtos/upload-plan-body.dto';
import { RenameDto } from 'src/common/dtos/rename.dto';
import { RealtimeService } from 'src/realtime/realtime.service';

@UseGuards(AuthenticatedGuard)
@Controller('/api/plans')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly realtimeService: RealtimeService,
  ) {}

  @Post('upload-plan/:projectId')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5_000_000 } }))
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
    @Body() body: UploadPlanBodyDto,
    @CurrentUser() user: User,
  ) {
    validateUploadedFile(file, {
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInBytes: 5_000_000,
    });

    const fileName = body.name;
    const folderId = body.folderId;
    const uploadedPlanInfo = await this.planService.uploadPlan(
      fileName,
      projectId,
      folderId,
      user.id,
      file,
    );
    this.realtimeService.emitToProject(projectId, 'plan:created', {
      projectId,
      plan: uploadedPlanInfo,
      actorId: user.id,
    });

    return {
      message: 'Fichier sauvegardé avec succès',
      uploadedPlan: uploadedPlanInfo,
    };
  }

  @Get(':planId')
  async getPlan(@Param('planId') planId: string, @CurrentUser() user: User) {
    return await this.planService.getPlan(planId, user.id);
  }

  @Get('last-opened/:projectId')
  async getLastOpenedPlan(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return await this.planService.getLastOpenedPlan(projectId, user.id);
  }

  @Get(':projectId/:planId')
  async getPlansByProject(
    @Param('projectId') projectId: string,
    @Param('planId') planId: string,
    @CurrentUser() user: User,
  ) {
    return await this.planService.getPlanById(projectId, planId, user.id);
  }

  @Patch(':projectId/:planId/rename')
  async renamePlan(
    @Param('planId') planId: string,
    @Param('projectId') projectId: string,
    @Body() body: RenameDto,
    @CurrentUser() user: User,
  ) {
    return await this.planService.renamePlan(
      planId,
      body.newName,
      projectId,
      user.id,
    );
  }

  @Delete(':planId')
  async deletePlan(
    @Param('planId') planId: string,
    @CurrentUser() user: User,
  ) {
    const deletedPlan = await this.planService.deletePlan(planId, user.id);

    this.realtimeService.emitToProject(deletedPlan.projectId, 'plan:deleted', {
      projectId: deletedPlan.projectId,
      planId: deletedPlan.id,
      actorId: user.id,
    });

    return {
      success: true,
      message: 'Plan supprimé avec succès',
    };
  }
}
