import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateYearOptionDto {
    @ApiProperty({ example: 2022 })
    @IsNumber()
    year: number;

    @ApiProperty({ example: 'uuid-de-version' })
    @IsUUID()
    versionId: string;
}
