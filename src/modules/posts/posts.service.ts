import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Vehicle } from 'src/entities/vehicle.entity';
import { User } from 'src/entities/user.entity';
import { CreatePostDto } from 'src/dto/postsDto/create-post.dto';
import { UpdatePostDto } from 'src/dto/postsDto/update-post.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ResponseIdDto, ResponsePagPostsDto, ResponsePostDto } from '../../dto/postsDto/responses-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getPosts(paginationDto: PaginationDto): Promise<ResponsePagPostsDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Obtener posts con paginación
    const [posts, total] = await this.postsRepository.findAndCount({
      skip,
      take: limit,
      where: { status: 'Active' },
      relations: {
        user: true,
        vehicle: {
          brand: true,
          model: true,
          yearOption: true,
        },
      },
      order: { postDate: 'DESC' } as FindOptionsOrder<Post>,
    });

    // Calcular número total de páginas
    const totalPages = Math.ceil(total / limit);

    // Filtrar datos del usuario para mostrar solo lo necesario
    const securePosts = posts.map(post => {
      if (post.user) {
        const { id, name, phone } = post.user;
        post.user = { id, name, phone } as User;
      }
      return post;
    });

    // Devolver objeto con datos paginados
    return {
      data: securePosts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getPostById(id: string): Promise<ResponsePostDto> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        vehicle: {
          brand: true,
          model: true,
          yearOption: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Filtrar datos del usuario para mostrar solo lo necesario
    if (post.user) {
      const { id: userId, name, phone } = post.user;
      post.user = { id: userId, name, phone } as User;
    }

    return {
      data: post,
      message: 'Post found successfully.',
    };
  }

  async getUserPosts(userId: string, paginationDto: PaginationDto): Promise<ResponsePagPostsDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Obtener posts del usuario con paginación
    const [posts, total] = await this.postsRepository.findAndCount({
      skip,
      take: limit,
      where: { user: { id: userId } },
      relations: {
        user: true,
        vehicle: {
          brand: true,
          model: true,
          yearOption: true,
        },
      },
      order: { postDate: 'DESC' } as FindOptionsOrder<Post>,
    });

    // Calcular número total de páginas
    const totalPages = Math.ceil(total / limit);

    // Filtrar datos del usuario para mostrar solo lo necesario
    const securePosts = posts.map(post => {
      if (post.user) {
        const { id, name, phone } = post.user;
        post.user = { id, name, phone } as User;
      }
      return post;
    });

    // Devolver objeto con datos paginados
    return {
      data: securePosts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async createPost(createPostDto: CreatePostDto): Promise<ResponseIdDto> {
    const { userId, vehicleId, status = 'Active' } = createPostDto;

    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Verificar que el vehículo existe y pertenece al usuario
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id: vehicleId, user: { id: userId } },
    });
    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with ID ${vehicleId} not found or does not belong to user with ID ${userId}.`,
      );
    }

    // Verificar si ya existe un post activo para este vehículo
    const existingPost = await this.postsRepository.findOne({
      where: { vehicle: { id: vehicleId }, status: 'Active' },
    });

    if (existingPost) {
      throw new ForbiddenException(
        `An active post already exists for vehicle with ID ${vehicleId}.`,
      );
    }

    // Crear y guardar el nuevo post
    const newPost = this.postsRepository.create({
      user,
      vehicle,
      status: status as PostStatus,
    });

    const savedPost = await this.postsRepository.save(newPost);

    return {
      data: savedPost.id,
      message: 'Post created successfully.',
    };
  }

  async updatePost(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<ResponseIdDto> {
    // Verificar que el post existe y pertenece al usuario
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(`Post with ID ${id} does not belong to user with ID ${userId}.`);
    }

    // Actualizar el post
    await this.postsRepository.update(id, updatePostDto);

    return {
      data: id,
      message: 'Post updated successfully.',
    };
  }

  async adminUpdatePost(id: string, updatePostDto: UpdatePostDto): Promise<ResponseIdDto> {
    // Verificar que el post existe
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Actualizar el post
    await this.postsRepository.update(id, updatePostDto);

    return {
      data: id,
      message: 'Post updated successfully by admin.',
    };
  }

  async deletePost(id: string, userId: string): Promise<ResponseIdDto> {
    // Verificar que el post existe y pertenece al usuario
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(`Post with ID ${id} does not belong to user with ID ${userId}.`);
    }

    // Marcar el post como inactivo en lugar de eliminarlo físicamente
    await this.postsRepository.update(id, { status: 'Inactive' });

    return {
      data: id,
      message: 'Post deleted successfully.',
    };
  }

  async adminDeletePost(id: string): Promise<ResponseIdDto> {
    // Verificar que el post existe
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Marcar el post como rechazado
    await this.postsRepository.update(id, { status: 'Rejected' });

    return {
      data: id,
      message: 'Post rejected by admin.',
    };
  }
}
