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
import { Public } from 'src/decorators/publicRoutes.decorator';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/DTOs/postsDto/createPost.dto';
import { UpdatePostDto } from 'src/DTOs/postsDto/updatePost.dto';
import { ResponsePaginatedPostsDto } from 'src/DTOs/postsDto/responsePaginatedPosts.dto';
import { QueryPostsDto } from 'src/DTOs/postsDto/queryPosts.dto';

@ApiTags('posts')
@ApiExtraModels(CreatePostDto, UpdatePostDto)
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  @HttpCode(200)
  async getPosts(@Query() paginationDto: QueryPostsDto): Promise<ResponsePaginatedPostsDto> {
    return await this.postsService.getPosts(paginationDto);
  }

  @Get('me')
  @HttpCode(200)
  async getMyPosts(
    @UserAuthenticated('sub') userId: string,
    @Query() paginationDto: ResponsePaginatedPostsDto,
  ): Promise<ResponsePaginatedPostsDto> {
    return await this.postsService.getUserPosts(userId, paginationDto);
  }

  @Get('user/:userId')
  @Public()
  @HttpCode(200)
  async getUserPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: ResponsePaginatedPostsDto,
  ): Promise<ResponsePaginatedPostsDto> {
    return await this.postsService.getUserPosts(userId, paginationDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.getPostById(id);
  }

  @Post()
  @HttpCode(201)
  async createPost(@UserAuthenticated('sub') userId: string, @Body() createPostDto: CreatePostDto) {
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
  ) {
    return await this.postsService.updatePost(id, userId, updatePostDto);
  }

  @Patch('admin/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async adminUpdatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.adminUpdatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @UserAuthenticated('sub') userId: string,
  ) {
    return await this.postsService.deletePost(id, userId);
  }

  @Delete('admin/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async adminDeletePost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.adminDeletePost(id);
  }
}
