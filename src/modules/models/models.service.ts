import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from 'src/entities/model.entity';
import { Brand } from 'src/entities/brand.entity';
import { CreateModelDto } from 'src/DTOs/vehicleDto/seederDto/create-model.dto';
import { UpdateModelDto } from 'src/DTOs/vehicleDto/seederDto/update-model.dto';

@Injectable()
export class ModelsService {
    constructor(
        @InjectRepository(Model)
        private readonly modelRepository: Repository<Model>,
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
    ) {}

    findAll(): Promise<Model[]> {
        return this.modelRepository.find({ relations: ['brand', 'versions'] });
    }

    async findOne(id: string): Promise<Model> {
        const model = await this.modelRepository.findOne({
            where: { id },
            relations: ['brand', 'versions'],
        });
        if (!model) throw new NotFoundException(`Model with ID ${id} not found`);
        return model;
    }

    async create(dto: CreateModelDto): Promise<Model> {
        const brand = await this.brandRepository.findOneBy({ id: dto.brandId });
        if (!brand) throw new NotFoundException(`Brand with ID ${dto.brandId} not found`);

        const model = this.modelRepository.create({
            name: dto.name,
            brand,
        });

        return this.modelRepository.save(model);
    }

    async update(id: string, dto: UpdateModelDto): Promise<Model> {
        const model = await this.findOne(id);

        if (dto.brandId) {
            const brand = await this.brandRepository.findOneBy({ id: dto.brandId });
            if (!brand) throw new NotFoundException(`Brand with ID ${dto.brandId} not found`);
            model.brand = brand;
        }

        if (dto.name !== undefined) model.name = dto.name;

        return this.modelRepository.save(model);
    }

    async delete(id: string): Promise<void> {
        const result = await this.modelRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Model with ID ${id} not found`);
    }
}
