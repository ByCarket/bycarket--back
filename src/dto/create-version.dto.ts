import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateVersionDto {
    @ApiProperty({ example: 'Sedan' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'uuid-del-model' })
    @IsUUID()
    modelId: string;
}
