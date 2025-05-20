import { PickType } from '@nestjs/swagger';
import { BasePostDto } from './basePosts.dto';

export class CreatePostDto extends PickType(BasePostDto, ['vehicleId'] as const) {}
