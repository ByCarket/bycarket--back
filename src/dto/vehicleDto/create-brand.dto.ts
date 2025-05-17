import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({ example: 'Toyota' })
    @IsString()
    @MinLength(2)
    name: string;
}
