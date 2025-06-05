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
      console.log(`Email de bienvenida enviado a: ${email}`);
    } catch (error) {
      console.error('Error enviando email de bienvenida:', error);
      throw error;
    }
  }

  async sendAccountActivationEmail(email: string, name: string, activationToken: string) {
    try {
      // URL base de tu frontend - configúrala según tu entorno
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const activationUrl = `${frontendUrl}/activate-account?token=${activationToken}`;

      await this.mailerService.sendMail({
        to: email,
        subject: '¡Activa tu cuenta para comenzar!',
        template: './account-activation',
        context: {
          name,
          activationUrl,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      });
      console.log(`Email de activación enviado a: ${email}`);
    } catch (error) {
      console.error('Error enviando email de activación:', error);
      throw error;
    }
  }

  async sendAccountActivatedEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Cuenta activada exitosamente!',
        template: './account-activated',
        context: {
          name,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      });
      console.log(`Confirmación de activación enviada a: ${email}`);
    } catch (error) {
      console.error('Error enviando confirmación de activación:', error);
      // No lanzar error para no afectar la activación
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

  async sendVehicleCreatedNotification(
    email: string,
    name: string,
    vehicleInfo: {
      brand: string;
      model: string;
      version: string;
      year: number;
    },
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Vehículo registrado exitosamente!',
        template: './vehicle-created',
        context: {
          name,
          vehicleBrand: vehicleInfo.brand,
          vehicleModel: vehicleInfo.model,
          vehicleVersion: vehicleInfo.version,
          vehicleYear: vehicleInfo.year,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      });
      console.log(`Notificación de vehículo creado enviada a: ${email}`);
    } catch (error) {
      console.error('Error enviando notificación de vehículo creado:', error);
      // No lanzamos el error para que no afecte la creación del vehículo
      console.warn('La notificación de email falló, pero el vehículo fue creado correctamente');
    }
  }

  async sendVehicleUpdatedNotification(
    email: string,
    name: string,
    vehicleInfo: {
      brand: string;
      model: string;
      version: string;
      year: number;
    },
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Información de vehículo actualizada',
        template: './vehicle-updated',
        context: {
          name,
          vehicleBrand: vehicleInfo.brand,
          vehicleModel: vehicleInfo.model,
          vehicleVersion: vehicleInfo.version,
          vehicleYear: vehicleInfo.year,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
      console.log(`Notificación de vehículo actualizado enviada a: ${email}`);
    } catch (error) {
      console.error('Error enviando notificación de vehículo actualizado:', error);
      // No lanzamos el error para que no afecte la actualización del vehículo
      console.warn(
        'La notificación de email falló, pero el vehículo fue actualizado correctamente',
      );
    }
  }

  async sendVehicleDeletedNotification(
    email: string,
    name: string,
    vehicleInfo: {
      brand: string;
      model: string;
      version: string;
      year: number;
    },
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Vehículo eliminado de tu cuenta',
        template: './vehicle-deleted',
        context: {
          name,
          vehicleBrand: vehicleInfo.brand,
          vehicleModel: vehicleInfo.model,
          vehicleVersion: vehicleInfo.version,
          vehicleYear: vehicleInfo.year,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
      console.log(`Notificación de vehículo eliminado enviada a: ${email}`);
    } catch (error) {
      console.error('Error enviando notificación de vehículo eliminado:', error);
      // No lanzamos el error para que no afecte la eliminación del vehículo
      console.warn('La notificación de email falló, pero el vehículo fue eliminado correctamente');
    }
  }

  async sendSubscriptionPaymentSuccessEmail(
    email: string,
    name: string,
    paymentInfo: {
      amount: number;
      currency: string;
      invoiceId: string | undefined;
      subscriptionPeriodStart: Date;
      subscriptionPeriodEnd: Date;
    },
  ) {
    try {
      // Formatear el monto según la moneda
      const formattedAmount = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: paymentInfo.currency.toUpperCase(),
      }).format(paymentInfo.amount / 100); // Stripe maneja los montos en centavos

      await this.mailerService.sendMail({
        to: email,
        subject: '¡Pago de suscripción procesado exitosamente!',
        template: './subscription-payment-success',
        context: {
          name,
          amount: formattedAmount,
          currency: paymentInfo.currency.toUpperCase(),
          invoiceNumber: paymentInfo.invoiceId,
          periodStart: paymentInfo.subscriptionPeriodStart.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          periodEnd: paymentInfo.subscriptionPeriodEnd.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          paymentDate: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          paymentTime: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
      console.log(`Notificación de pago exitoso enviada a: ${email}`);
    } catch (error) {
      console.error('Error enviando notificación de pago exitoso:', error);
      // No lanzamos el error para que no afecte el procesamiento del webhook
      console.warn('La notificación de email falló, pero el pago fue procesado correctamente');
    }
  }
}
