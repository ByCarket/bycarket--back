import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { ModifyUserDto } from 'src/dto/modify-user.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';
import {
  ResponseIdDto,
  ResponsePagUsersDto,
  ResponsePrivateUserDto,
  ResponsePublicUserDto,
} from 'src/dto/responses-user.dto';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsers(paginationDto: PaginationDto): Promise<ResponsePagUsersDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Obtener usuarios con paginación
    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      select: [
        'id',
        'name',
        'email',
        'phone',
        'country',
        'city',
        'address',
        'role',
      ] as (keyof User)[],
      order: { name: 'ASC' } as FindOptionsOrder<User>,
    });

    // Calcular número total de páginas
    const totalPages = Math.ceil(total / limit);

    // Eliminar el campo password de los resultados (en caso que no esté filtrado por select)
    const secureUsers = users.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...userToReturn }) => userToReturn,
    );

    // Devolver objeto con datos paginados
    return {
      data: secureUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getMyUser(id: string): Promise<ResponsePrivateUserDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        posts: true,
        questions: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const { password, ...data } = user;
    return {
      data,
      message: 'User found successfully.',
    };
  }

  async getUserById(id: string): Promise<ResponsePublicUserDto> {
    const data = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'address', 'city', 'country', 'isActive', 'phone'],
      relations: { posts: true },
    });
    if (!data) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return {
      data,
      message: 'User found successfully.',
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async updateMyUser(id: string, user: ModifyUserDto): Promise<ResponseIdDto> {
    const result = await this.usersRepository.update(id, user);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return {
      data: id,
      message: 'User updated successfully.',
    };
  }

  async upgradeToAdmin(id: string): Promise<ResponseIdDto> {
    const result = await this.usersRepository.update(id, { role: Role.ADMIN });
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return {
      data: id,
      message: 'User upgraded to admin successfully.',
    };
  }

  async deleteUser(id: string): Promise<ResponseIdDto> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return {
      data: id,
      message: 'User deleted successfully.',
    };
  }
}
