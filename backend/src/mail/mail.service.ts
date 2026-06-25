import { Injectable } from '@nestjs/common';
import { MailerOptionInterface } from './interfaces/MailerOptionInterface';
import { err, ok } from 'src/Error/Result';
import { MailNotSendedError } from 'src/Error/MailError';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  resetPasswordMailOptions(to: string, resetLink: string) {
    const mailerOptions: MailerOptionInterface = {
      from: process.env.SMTP_FROM as string,
      to: to,
      subject: 'Réinitialisation du mot de passe',
      html: `<div>
      <p>Bonjour, vous recevez ce mail car vous avez demandé à réinitialiser votre mot de passe.</p>
      <p><strong>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</strong></p>
      <p>Sinon, <a href=${resetLink}>cliquez ici</a></p>
      </div>`,
    };

    return mailerOptions;
  }

  async sendMail(mailOptions: MailerOptionInterface) {
    try {
      await this.mailerService.sendMail(mailOptions);
      return ok('Le message a bien été envoyé');
    } catch (error: any) {
      return err(
        new MailNotSendedError("Erreur lors de l'envoie de mail:" + error),
      );
    }
  }
}
