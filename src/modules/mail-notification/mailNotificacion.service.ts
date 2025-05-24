import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Bienvenido a nuestra plataforma!',
        template: './welcome',
        context: {
          name,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      });
      // console.log(`Email de bienvenida enviado a: ${email}`);
    } catch (error) {
      console.error('Error enviando email de bienvenida:', error);
      throw error;
    }
  }


  async sendPasswordChangeNotification(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Contraseña modificada exitosamente',
        template: './password-change',
        context: {
          name,
          date: new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
      // console.log(`Notificación de cambio de contraseña enviada a: ${email}`);
    } catch (error) {
      console.error('Error enviando notificación de cambio de contraseña:', error);
      throw error;
    }
  }
}