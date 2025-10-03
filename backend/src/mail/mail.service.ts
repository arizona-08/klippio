import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";
import { MailerOptionInterface } from "./interfaces/MailerOptionInterface";
import { err, ok } from "src/Error/Result";
import { MailNotSendedError } from "src/Error/MailError";

@Injectable()
export class MailService{
  getTransporter(){
    const mailerDSN = process.env.MAILER_DSN
    const transporter = nodemailer.createTransport(mailerDSN)

    return transporter
  }

  resetPasswordMailOptions(from: string, to: string, resetLink: string){
    const mailerOptions: MailerOptionInterface = {
      from: `Team Klippio <${from}>`,
      to: to,
      subject: "Réinitialisation du mot de passe",
      html: `<div>
      <p>Bonjour, vous recevez ce mail car vous avez demandé à réinitialiser votre mot de passe.</p>
      <p><strong>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</strong></p>
      <p>Sinon, <a href=${resetLink}>cliquez ici</a></p>
      </div>`,
      
    }

    return mailerOptions;
  }

  async sendMail(mailOptions: MailerOptionInterface){
    try{
      const transporter = this.getTransporter();
      await transporter.sendMail(mailOptions)
      return ok('Le message a bien été envoyé')
    } catch (error: any){
      return err(new MailNotSendedError("Erreur lors de l'envoie de mail:" + error))
    }
  }
}