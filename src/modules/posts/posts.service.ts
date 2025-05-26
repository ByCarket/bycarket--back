import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { Vehicle } from 'src/entities/vehicle.entity';
import { User } from 'src/entities/user.entity';
import { PostStatus } from 'src/enums/postStatus.enum';
import { ResponsePaginatedPostsDto } from 'src/DTOs/postsDto/responsePaginatedPosts.dto';
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

  async getPosts({
    page,
    limit,
    search,
    orderBy,
    order,
    ...filters
  }: QueryPostsDto): Promise<ResponsePaginatedPostsDto> {
    const query = await this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('vehicle.version', 'version')
      .where('posts.status = :status', { status: PostStatus.ACTIVE });

    const exactFilters = {
      brandId: 'brand.id',
      modelId: 'model.id',
      versionId: 'version.id',
      typeOfVehicle: 'vehicle.typeOfVehicle',
      condition: 'vehicle.condition',
      currency: 'vehicle.currency',
    };

    const rangeFilters = {
      minYear: { column: 'vehicle.year', operator: '>=' },
      maxYear: { column: 'vehicle.year', operator: '<=' },

      minPrice: { column: 'vehicle.price', operator: '>=' },
      maxPrice: { column: 'vehicle.price', operator: '<=' },

      minMileage: { column: 'vehicle.mileage', operator: '>=' },
      maxMileage: { column: 'vehicle.mileage', operator: '<=' },
    };

    const cleanedFilters = Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    );

    if (search) {
      query.andWhere(
        `(LOWER(vehicle.description) ILIKE :search OR
        LOWER(brand.name) ILIKE :search OR
        LOWER(model.name) ILIKE :search OR
        LOWER(version.name) ILIKE :search)`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    for (const [key, value] of cleanedFilters) {
      if (exactFilters[key]) {
        query.andWhere(`${exactFilters[key]} = :${key}`, { [key]: value });
      }

      if (rangeFilters[key]) {
        const { column, operator } = rangeFilters[key];
        query.andWhere(`${column} ${operator} :${key}`, { [key]: value });
      }
    }

    query.orderBy(orderBy, order);

    const skip = (page - 1) * limit;
    const [data, total] = await query.take(limit).skip(skip).getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostById(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        vehicle: {
          brand: true,
          model: true,
          version: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Filtrar datos del usuario para mostrar solo lo necesario
    if (post.user) {
      const { name, phone } = post.user;
      post.user = { name, phone } as User;
    }

    return {
      data: post,
      message: 'Post found successfully.',
    };
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

    // Solo actualizar la descripción del vehículo si se proporciona una nueva
    if (description !== undefined && description !== null && description.trim() !== '') {
      vehicle.description = description;
      await this.vehiclesRepository.save(vehicle);
    }

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
    await this.postsRepository.update(id, { status: PostStatus.INACTIVE });

    return {
      data: id,
      message: 'Post rejected by admin.',
    };
  }
}
