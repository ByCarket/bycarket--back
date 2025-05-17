import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/dto/usersDto/create-user.dto';
import { LoginUserDto } from 'src/dto/usersDto/login-user.dto';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtSign } from 'src/interfaces/jwtPayload.interface';
import { ResponseIdDto } from 'src/dto/usersDto/responses-user.dto';
import { ChangePasswordDto } from 'src/dto/usersDto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(user: Omit<CreateUserDto, 'confirmPassword'>) {
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

  async changeEmail(id: string, newEmail: string): Promise<ResponseIdDto> {
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

  async changePassword(
    id: string,
    { oldPassword, password }: ChangePasswordDto,
  ): Promise<ResponseIdDto> {
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
