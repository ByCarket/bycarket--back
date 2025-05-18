import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/entities/brand.entity';
import { CreateBrandDto } from 'src/DTOs/vehicleDto/seederDto/create-brand.dto';
import { UpdateBrandDto } from 'src/DTOs/vehicleDto/seederDto/update-brand.dto';


@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
    ) {}

    findAll(): Promise<Brand[]> {
        return this.brandRepository.find({ relations: ['models'] });
    }

    async findOne(id: string): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { id },
            relations: ['models'],
        });
        if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
        return brand;
    }

    create(dto: CreateBrandDto): Promise<Brand> {
        const brand = this.brandRepository.create(dto);
        return this.brandRepository.save(brand);
    }

    async update(id: string, dto: UpdateBrandDto): Promise<Brand> {
        await this.brandRepository.update(id, dto);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.brandRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Brand with ID ${id} not found`);
    }
}
