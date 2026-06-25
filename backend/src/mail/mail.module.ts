import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const port = Number(configService.get<string>('SMTP_PORT') ?? 587);

        return {
          transport: {
            host: configService.get<string>('SMTP_HOST'),
            port,
            secure: port === 465,
            requireTLS: port === 587,
            auth: {
              user: configService.get<string>('SMTP_USER'),
              pass: configService.get<string>('SMTP_PASS'),
            },
          },
          defaults: {
            from: configService.get<string>('SMTP_FROM'),
          },
        };
      },
    }),
  ],
})
export class MailModule {}
