import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/DTOs/usersDto/createUser.dto';
import { LoginUserDto } from 'src/DTOs/usersDto/loginUser.dto';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtSign } from 'src/interfaces/jwtPayload.interface';
import { ChangePasswordDto } from 'src/DTOs/usersDto/changePassword.dto';
import { GoogleProfileDto } from 'src/DTOs/usersDto/google-profile.dto';
import { MailService } from '../mail-notification/mailNotificacion.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  // Método auxiliar para generar token de activación
  private generateActivationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register({ confirmPassword, password, ...user }: CreateUserDto) {
    const userExist = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (userExist) {
      throw new BadRequestException('Email already registered');
    }

    // Generar token de activación
    const activationToken = this.generateActivationToken();
    const activationTokenExpires = new Date();
    activationTokenExpires.setHours(activationTokenExpires.getHours() + 24); // Expira en 24 horas
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
      activationToken,
      activationTokenExpires,
    });
    const savedUser = await this.usersRepository.save(newUser);
    try {
      // Enviar email de activación
      await this.mailService.sendAccountActivationEmail(
        savedUser.email,
        savedUser.name,
        activationToken,
      );
    } catch (emailError) {
      emailError;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newUserPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async activateAccount(token: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          activationToken: token,
          isActive: false,
        },
      });

      if (!user) {
        throw new BadRequestException('Token de activación inválido o cuenta ya activada');
      }

      // Verificar si el token ha expirado
      if (!user.activationTokenExpires || user.activationTokenExpires < new Date()) {
        throw new BadRequestException('El token de activación ha expirado');
      }

      // Activar la cuenta
      user.isActive = true;
      user.activationToken = null;
      user.activationTokenExpires = null;

      await this.usersRepository.save(user);

      // Enviar email de confirmación de activación
      await this.mailService.sendAccountActivatedEmail(user.email, user.name);

      return {
        message: 'Cuenta activada exitosamente. Ya puedes iniciar sesión.',
      };
    } catch (error) {
      throw error;
    }
  }

  // NUEVO MÉTODO - Reenviar email de activación
  async resendActivationEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email,
          isActive: false,
        },
      });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado o cuenta ya activada');
      }

      // Generar nuevo token
      const activationToken = this.generateActivationToken();
      const activationTokenExpires = new Date();
      activationTokenExpires.setHours(activationTokenExpires.getHours() + 24);

      user.activationToken = activationToken;
      user.activationTokenExpires = activationTokenExpires;

      await this.usersRepository.save(user);

      // Enviar nuevo email de activación
      await this.mailService.sendAccountActivationEmail(user.email, user.name, activationToken);

      return {
        message: 'Email de activación reenviado exitosamente.',
      };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Cuenta no activada. Revisa tu email para activar tu cuenta.',
      );
    }
    const jwtPayload: JwtSign = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(jwtPayload);
    return { success: 'Login successfully', token };
  }

  async processGoogleUser(googleProfile: GoogleProfileDto) {
    const { email, name, sub } = googleProfile;

    let user = await this.usersService.getUserByEmail(email);

    if (!user) {
      const newUser = this.usersRepository.create({
        email,
        name: name || email.split('@')[0],
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        googleId: sub,
        phone: undefined,
        country: '',
        city: '',
        address: '',
        isActive: true,
      });
      user = await this.usersRepository.save(newUser);

      // Enviar email de bienvenida para usuarios de Google nuevos
      try {
        await this.mailService.sendWelcomeEmail(user.email, user.name);
      } catch (emailError) {
        emailError;
      }
    } else if (!user.googleId) {
      user.googleId = sub;
      await this.usersRepository.save(user);
    }

    const jwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(jwtPayload);

    return {
      success: 'Login successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async createAdmin(user: Omit<CreateUserDto, 'confirmPassword'>) {
    const { email, password } = user;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });

    if (userExist) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.save({
      ...user,
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newUserPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async changeEmail(id: string, newEmail: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const emailExist = await this.usersRepository.findOneBy({ email: newEmail });
    if (emailExist) {
      throw new BadRequestException('Email already registered');
    }

    user.email = newEmail;
    await this.usersRepository.save(user);

    return {
      data: id,
      message: 'Email changed successfully',
    };
  }

  async changePassword(id: string, { oldPassword, password }: ChangePasswordDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Enviar notificación de cambio de contraseña
    try {
      await this.mailService.sendPasswordChangeNotification(user.email, user.name);
    } catch (emailError) {
      emailError;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.update(id, { password: hashedPassword });
    return {
      data: id,
      message: 'Password changed successfully',
    };
  }
}
