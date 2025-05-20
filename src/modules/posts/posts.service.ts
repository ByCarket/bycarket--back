import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { Vehicle } from 'src/entities/vehicle.entity';
import { User } from 'src/entities/user.entity';
import { PostStatus } from 'src/enums/postStatus.enum';
import { ResponsePaginatedPostsDto } from 'src/DTOs/postsDto/responsePaginatedPosts.dto';
import { PostDetail } from 'src/DTOs/postsDto/postDetail.dto';
import { CreatePostDto } from 'src/DTOs/postsDto/createPost.dto';
import { QueryPostsDto } from 'src/DTOs/postsDto/queryPosts.dto';

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

  async getPosts({ page, limit }: QueryPostsDto): Promise<ResponsePaginatedPostsDto> {
    const skip = (page - 1) * limit;

    // Obtener posts con paginación
    const [posts, total] = await this.postsRepository.findAndCount({
      skip,
      take: limit,
      where: { status: PostStatus.ACTIVE },
      relations: {
        user: true,
        vehicle: {
          brand: true,
          model: true,
          version: true,
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

  async getPostById(id: string): Promise<PostDetail> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: { user: true, vehicle: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Filtrar datos del usuario para mostrar solo lo necesario
    if (post.user) {
      const { name, phone } = post.user;
      post.user = { name, phone } as User;
    }

    return post;
  }

  async getUserPosts(
    userId: string,
    { page, limit }: QueryPostsDto,
  ): Promise<ResponsePaginatedPostsDto> {
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
          version: true,
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

  async createPost({ vehicleId, description }: CreatePostDto, userId: string) {
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
    vehicle.description = description;
    await this.vehiclesRepository.save(vehicle);

    // Verificar si ya existe un post activo para este vehículo
    const existingPost = await this.postsRepository.findOne({
      where: { vehicle: { id: vehicleId }, status: PostStatus.ACTIVE },
      relations: { vehicle: true },
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
      postDate: new Date(),
    });

    const savedPost = await this.postsRepository.save(newPost);

    return {
      data: savedPost.id,
      message: 'Post created successfully.',
    };
  }

  async updatePost(id: string, userId: string) {
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
    await this.postsRepository.update(id, { status: PostStatus.SOLD });

    return {
      data: id,
      message: 'Post updated successfully.',
    };
  }

  async adminUpdatePost(id: string, status: PostStatus) {
    // Verificar que el post existe
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Actualizar el post
    await this.postsRepository.update(id, { status });

    return {
      data: id,
      message: 'Post updated successfully by admin.',
    };
  }

  async deletePost(id: string, userId: string) {
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
    await this.postsRepository.update(id, { status: PostStatus.INACTIVE });

    return {
      data: id,
      message: 'Post deleted successfully.',
    };
  }

  async adminDeletePost(id: string) {
    // Verificar que el post existe
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Marcar el post como rechazado
    await this.postsRepository.update(id, { status: PostStatus.REJECTED });

    return {
      data: id,
      message: 'Post rejected by admin.',
    };
  }
}
