import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserActionNotification(email: string, action: string, details: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Notificación de acción: ${action}`,
      template: './action-notification', // Nombre del template (crearás este archivo)
      context: {
        action,
        details,
        date: new Date().toLocaleString(),
      },
    });
  }
}