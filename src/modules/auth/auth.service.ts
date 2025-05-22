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
import { CustomerService } from '../billing/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register({ confirmPassword, password, ...user }: CreateUserDto) {
    const userExist = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (userExist) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const stripeCustomerId = await this.customerService.createCustomer({
      email: user.email,
      name: user.name,
    });

    const newUser = await this.usersRepository.save({
      ...user,
      password: hashedPassword,
      stripeCustomerId,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newUserPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
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
      const stripeCustomerId = await this.customerService.createCustomer({
        email,
        name: name || email.split('@')[0],
      });
      const newUser = {
        email,
        name: name || email.split('@')[0],
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        googleId: sub,
        phone: undefined,
        country: '',
        city: '',
        address: '',
        stripeCustomerId,
      };

      user = await this.usersRepository.create(newUser);
      await this.usersRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = sub;
      await this.usersRepository.save(user);
    }

    const jwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(jwtPayload);

    return { success: 'Login successfully', token };
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
    await this.customerService.updateCustomer(user.stripeCustomerId, { email: newEmail });

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

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.update(id, { password: hashedPassword });
    return {
      data: id,
      message: 'Password changed successfully',
    };
  }
}
