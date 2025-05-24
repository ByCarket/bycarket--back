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
import { ResponsePaginatedPostsDto } from 'src/DTOs/postsDto/responsePaginatedPosts.dto';
import { QueryPostsDto } from 'src/DTOs/postsDto/queryPosts.dto';
import { PostStatus } from 'src/enums/postStatus.enum';
import { ApiGetPostsDocs } from './decorators/apiGetPostsDocs.decorator';

@ApiTags('posts')
@ApiExtraModels(CreatePostDto)
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiGetPostsDocs()
  @Get()
  @Public()
  @HttpCode(200)
  async getPosts(@Query() queryDto: QueryPostsDto): Promise<ResponsePaginatedPostsDto> {
    return await this.postsService.getPosts(queryDto);
  }

  @Get('me')
  @HttpCode(200)
  async getMyPosts(
    @UserAuthenticated('sub') userId: string,
    @Query() paginationDto: QueryPostsDto,
  ): Promise<ResponsePaginatedPostsDto> {
    return await this.postsService.getUserPosts(userId, paginationDto);
  }

  @Get('user/:userId')
  @Public()
  @HttpCode(200)
  async getUserPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: QueryPostsDto,
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
    return await this.postsService.createPost(createPostDto, userId);
  }

  @Patch('sold/:id')
  @HttpCode(200)
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @UserAuthenticated('sub') userId: string,
  ) {
    return await this.postsService.updatePost(id, userId);
  }

  @Patch('accept/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async adminAcceptPost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.adminUpdatePost(id, PostStatus.ACTIVE);
  }

  @Patch('reject/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async adminRejectPost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsService.adminUpdatePost(id, PostStatus.REJECTED);
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
