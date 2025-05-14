// vehicles.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from '../../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../../dto//update-vehicle.dto';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { YearOption } from 'src/entities/year.entity';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,

        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,

        @InjectRepository(Model)
        private readonly modelRepository: Repository<Model>,

        @InjectRepository(YearOption)
        private readonly yearOptionRepository: Repository<YearOption>,
    ) {}

    // ✅ GET all vehicles paginated
    async getVehicles(page: number, limit: number): Promise<Vehicle[]> {
        const skip = (page - 1) * limit;
        return this.vehicleRepository.find({
            skip,
            take: limit,
            relations: ['brand', 'model', 'yearOption'],
        });
    }

    // ✅ GET vehicle by id
    async getVehicleById(id: string): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
            relations: ['brand', 'model', 'yearOption'],
        });

        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }

        return vehicle;
    }

    // ✅ CREATE vehicle
    async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        const brand = await this.brandRepository.findOneBy({ id: createVehicleDto.brandId });
        const model = await this.modelRepository.findOneBy({ id: createVehicleDto.modelId });
        const yearOption = await this.yearOptionRepository.findOneBy({ id: createVehicleDto.yearOptionId });

        if (!brand) throw new NotFoundException(`Brand with ID ${createVehicleDto.brandId} not found`);
        if (!model) throw new NotFoundException(`Model with ID ${createVehicleDto.modelId} not found`);
        if (!yearOption) throw new NotFoundException(`YearOption with ID ${createVehicleDto.yearOptionId} not found`);

        const vehicle = this.vehicleRepository.create({
            brand,
            model,
            yearOption,
            price: createVehicleDto.price,
            mileage: createVehicleDto.mileage,
            description: createVehicleDto.description,
        });

        return this.vehicleRepository.save(vehicle);
    }

    // ✅ UPDATE vehicle
    async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });

        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }

        if (updateVehicleDto.brandId) {
            const brand = await this.brandRepository.findOneBy({ id: updateVehicleDto.brandId });
            if (!brand) throw new NotFoundException(`Brand with ID ${updateVehicleDto.brandId} not found`);
            vehicle.brand = brand;
        }

        if (updateVehicleDto.modelId) {
            const model = await this.modelRepository.findOneBy({ id: updateVehicleDto.modelId });
            if (!model) throw new NotFoundException(`Model with ID ${updateVehicleDto.modelId} not found`);
            vehicle.model = model;
        }

        if (updateVehicleDto.yearOptionId) {
            const yearOption = await this.yearOptionRepository.findOneBy({ id: updateVehicleDto.yearOptionId });
            if (!yearOption) throw new NotFoundException(`YearOption with ID ${updateVehicleDto.yearOptionId} not found`);
            vehicle.yearOption = yearOption;
        }

        if (updateVehicleDto.price !== undefined) vehicle.price = updateVehicleDto.price;
        if (updateVehicleDto.mileage !== undefined) vehicle.mileage = updateVehicleDto.mileage;
        if (updateVehicleDto.description !== undefined) vehicle.description = updateVehicleDto.description;

        return this.vehicleRepository.save(vehicle);
    }

    // ✅ DELETE vehicle
    async deleteVehicle(id: string): Promise<void> {
        const result = await this.vehicleRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
    }
}
