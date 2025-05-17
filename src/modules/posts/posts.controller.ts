import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/dto/postsDto/create-post.dto';
import { UpdatePostDto } from 'src/dto/postsDto/update-post.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ResponseIdDto, ResponsePagPostsDto, ResponsePostDto } from '../../dto/postsDto/responses-post.dto';

@ApiTags('posts')
@ApiExtraModels(CreatePostDto, UpdatePostDto)
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @HttpCode(200)
  async getPosts(@Query() paginationDto: PaginationDto): Promise<ResponsePagPostsDto> {
    return await this.postsService.getPosts(paginationDto);
  }

  @Get('user/:userId')
  @HttpCode(200)
  async getUserPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponsePagPostsDto> {
    return await this.postsService.getUserPosts(userId, paginationDto);
  }

  @Get('me')
  @HttpCode(200)
  async getMyPosts(
    @UserAuthenticated('sub') userId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponsePagPostsDto> {
    return await this.postsService.getUserPosts(userId, paginationDto);
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id', ParseUUIDPipe) id: string): Promise<ResponsePostDto> {
    return await this.postsService.getPostById(id);
  }

  @Post()
  @HttpCode(201)
  async createPost(
    @UserAuthenticated('sub') userId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponseIdDto> {
    // Asegurarnos de que el usuario que crea el post es el usuario autenticado
    createPostDto.userId = userId;
    return await this.postsService.createPost(createPostDto);
  }

  @Patch(':id')
  @HttpCode(200)
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @UserAuthenticated('sub') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseIdDto> {
    return await this.postsService.updatePost(id, userId, updatePostDto);
  }

  @Patch('admin/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async adminUpdatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseIdDto> {
    return await this.postsService.adminUpdatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @UserAuthenticated('sub') userId: string,
  ): Promise<ResponseIdDto> {
    return await this.postsService.deletePost(id, userId);
  }

  @Delete('admin/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async adminDeletePost(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseIdDto> {
    return await this.postsService.adminDeletePost(id);
  }
}
