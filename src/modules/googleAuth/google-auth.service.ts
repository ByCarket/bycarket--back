import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompleteProfileDto } from '../../dto/usersDto/complete-profile.dto';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async processGoogleUser(googleProfile: any): Promise<User> {
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
        profileComplete: false,
      };

      user = await this.usersRepository.create(newUser);
      await this.usersRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = sub;
      await this.usersRepository.save(user);
    }

    return user;
  }

  async completeUserProfile(userId: string, profileData: CompleteProfileDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (profileData.phone !== undefined) user.phone = profileData.phone;
    if (profileData.country !== undefined) user.country = profileData.country;
    if (profileData.city !== undefined) user.city = profileData.city;
    if (profileData.address !== undefined) user.address = profileData.address;

    user.profileComplete = true;

    await this.usersRepository.save(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersService.getUserByEmail(email);
  }
}