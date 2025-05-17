import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateModelDto {
    @ApiProperty({ example: 'Corolla' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'uuid-del-brand' })
    @IsUUID()
    brandId: string;
}
