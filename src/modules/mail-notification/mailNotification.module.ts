import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailNotificacion.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com', // Tu servidor SMTP
        port: 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: 'tu_email@example.com',
          pass: 'tu_contraseña',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}