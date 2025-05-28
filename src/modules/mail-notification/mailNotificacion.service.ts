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

  async sendVehicleCreatedNotification(
    email: string, 
    name: string, 
    vehicleInfo: {
      brand: string;
      model: string;
      version: string;
      year: number;
    }
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
    }
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
      console.warn('La notificación de email falló, pero el vehículo fue actualizado correctamente');
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
    }
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
}