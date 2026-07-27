import { Injectable } from '@nestjs/common';
import { MailerOptionInterface } from './interfaces/MailerOptionInterface';
import { err, ok } from 'src/Error/Result';
import { MailNotSendedError } from 'src/Error/MailError';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  resetPasswordMailOptions(to: string, resetLink: string) {
    return {
      from: process.env.SMTP_FROM as string,
      to,
      subject: 'Réinitialisation du mot de passe',
      html: this.renderEmail({
        preheader: 'Réinitialisez votre mot de passe Klippio.',
        eyebrow: 'SÉCURITÉ DU COMPTE',
        title: 'Réinitialisez votre mot de passe',
        content: `
          <p>Bonjour,</p>
          <p>Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte Klippio.</p>
          <p>Utilisez le bouton ci-dessous pour choisir un nouveau mot de passe.</p>
        `,
        action: { label: 'Réinitialiser mon mot de passe', url: resetLink },
        note: 'Ce lien est valable pendant une heure. Si vous n’avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité.',
      }),
    };
  }

  invitationMailOptions(data: {
    to: string;
    inviterName: string;
    projectTitle: string;
    invitationLink: string;
  }): MailerOptionInterface {
    const inviterName = this.escapeHtml(data.inviterName);
    const projectTitle = this.escapeHtml(data.projectTitle);

    return {
      from: process.env.SMTP_FROM as string,
      to: data.to,
      subject: `Invitation à rejoindre le projet « ${data.projectTitle} »`,
      html: this.renderEmail({
        preheader: `${data.inviterName} vous invite à collaborer sur Klippio.`,
        eyebrow: 'INVITATION À COLLABORER',
        title: 'Vous êtes invité(e) sur un projet',
        content: `
          <p>Bonjour,</p>
          <p><strong>${inviterName}</strong> vous invite à collaborer sur le projet <strong>« ${projectTitle} »</strong>.</p>
          <p>Rejoignez le projet pour consulter les documents et contribuer selon les droits qui vous ont été attribués.</p>
        `,
        action: { label: 'Rejoindre le projet', url: data.invitationLink },
        note: 'Cette invitation est valable pendant 24 heures. Si elle ne vous était pas destinée, vous pouvez ignorer cet email.',
      }),
    };
  }

  invitationDeclinedMailOptions(data: {
    to: string;
    ownerName: string;
    inviteeEmail: string;
    projectTitle: string;
  }): MailerOptionInterface {
    const ownerName = this.escapeHtml(data.ownerName);
    const inviteeEmail = this.escapeHtml(data.inviteeEmail);
    const projectTitle = this.escapeHtml(data.projectTitle);

    return {
      from: process.env.SMTP_FROM as string,
      to: data.to,
      subject: `Invitation refusée pour le projet « ${data.projectTitle} »`,
      html: this.renderEmail({
        preheader: `L’invitation au projet ${data.projectTitle} a été refusée.`,
        eyebrow: 'SUIVI DES INVITATIONS',
        title: 'Invitation refusée',
        content: `
          <p>Bonjour ${ownerName},</p>
          <p><strong>${inviteeEmail}</strong> a refusé votre invitation à collaborer sur le projet <strong>« ${projectTitle} »</strong>.</p>
          <p>Vous pouvez inviter une autre personne depuis les paramètres de partage du projet.</p>
        `,
      }),
    };
  }

  private renderEmail({
    preheader,
    eyebrow,
    title,
    content,
    action,
    note,
  }: {
    preheader: string;
    eyebrow: string;
    title: string;
    content: string;
    action?: { label: string; url: string };
    note?: string;
  }): string {
    const safePreheader = this.escapeHtml(preheader);
    const safeEyebrow = this.escapeHtml(eyebrow);
    const safeTitle = this.escapeHtml(title);
    const actionHtml = action
      ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0 26px;"><tr><td style="border-radius: 6px; background: #00AF63;"><a href="${this.escapeHtml(action.url)}" style="display: inline-block; padding: 14px 22px; color: #ffffff; font-family: Arial, sans-serif; font-size: 15px; font-weight: 700; text-decoration: none;">${this.escapeHtml(action.label)}</a></td></tr></table>`
      : '';
    const noteHtml = note
      ? `<p style="margin: 28px 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; line-height: 20px;">${this.escapeHtml(note)}</p>`
      : '';

    const logoHtml = `<img src="https://app.klippio.sajed-engineering.com/logos/logo_long_black.svg" alt="Klippio" width="154" style="display: block; width: 154px; height: auto; border: 0;">`;

    return `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin: 0; padding: 0; background: #f3f6fa;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">${safePreheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background: #f3f6fa;">
      <tr><td align="center" style="padding: 36px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px;">
          <tr><td align="center" style="padding: 0 8px 20px; color: #1e3a5f; font-family: Arial, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 1.5px;">${logoHtml}</td></tr>
          <tr><td style="overflow: hidden; border-radius: 10px; background: #ffffff; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr><td style="height: 5px; background: #00AF63;"></td></tr>
              <tr><td style="padding: 38px 40px 36px; color: #1f2937; font-family: Arial, sans-serif;">
                <p style="margin: 0 0 12px; color: #00AF63; font-size: 12px; font-weight: 700; letter-spacing: 1.2px;">${safeEyebrow}</p>
                <h1 style="margin: 0 0 24px; color: #111827; font-size: 28px; line-height: 34px;">${safeTitle}</h1>
                <div style="font-size: 16px; line-height: 25px;">${content}</div>
                ${actionHtml}
                ${noteHtml}
              </td></tr>
            </table>
          </td></tr>
          <tr><td align="center" style="padding: 20px 16px 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px;">Cet email a été envoyé automatiquement par Klippio.<br>© ${new Date().getFullYear()} Klippio. Tous droits réservés.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      };
      return entities[character];
    });
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
