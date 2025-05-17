import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async processGoogleUser(googleProfile: any): Promise<{ user: User; token: string }> {
    const { email, name, sub } = googleProfile;

    let user = await this.usersService.getUserByEmail(email);

    if (!user) {
      const newUser = {
        email,
        name: name || email.split('@')[0],
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        googleId: sub,
        phone: undefined,
        country: '',
        city: '',
        address: '',
        role: Role.USER,
      };

      user = await this.usersRepository.create(newUser);
      await this.usersRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = sub;
      await this.usersRepository.save(user);
    }


    const jwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(jwtPayload);

    return { user, token };
  }
}
