import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from '../../dto/vehicleDto/create-vehicle.dto';
import { UpdateVehicleDto } from '../../dto/vehicleDto/update-vehicle.dto';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { YearOption } from 'src/entities/year.entity';
import { User } from 'src/entities/user.entity';

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
  async createVehicle(
  createVehicleDto: CreateVehicleDto,
  userId: string,
): Promise<Vehicle> {
  const { brandId, modelId, versionId, year, price, mileage, description } = createVehicleDto;

  const brand = await this.brandRepository.findOneBy({ id: brandId });
  const model = await this.modelRepository.findOneBy({ id: modelId });

  if (!brand) throw new NotFoundException(`Brand with ID ${brandId} not found`);
  if (!model) throw new NotFoundException(`Model with ID ${modelId} not found`);

  let yearOption = await this.yearOptionRepository.findOne({
    where: {
      year,
      version: { id: versionId },
    },
    relations: ['version'],
  });

  if (!yearOption) {
    yearOption = this.yearOptionRepository.create({
      year,
      version: { id: versionId },
    });
    await this.yearOptionRepository.save(yearOption);
  }

  const vehicle = this.vehicleRepository.create({
    user: { id: userId } as User, // ← asignación obligatoria
    brand,
    model,
    yearOption,
    price,
    mileage,
    description,
  });

  return this.vehicleRepository.save(vehicle);
}


  // ✅ UPDATE vehicle
  async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id }, relations: ['yearOption', 'yearOption.version'] });

    if (!vehicle) throw new NotFoundException(`Vehicle with ID ${id} not found`);

    const {
      brandId,
      modelId,
      versionId,
      year,
      price,
      mileage,
      description,
    } = updateVehicleDto;

    if (brandId) {
      const brand = await this.brandRepository.findOneBy({ id: brandId });
      if (!brand) throw new NotFoundException(`Brand with ID ${brandId} not found`);
      vehicle.brand = brand;
    }

    if (modelId) {
      const model = await this.modelRepository.findOneBy({ id: modelId });
      if (!model) throw new NotFoundException(`Model with ID ${modelId} not found`);
      vehicle.model = model;
    }

    // Manejar cambio de versión o año
    if (versionId || year) {
      const versionToUse = versionId ?? vehicle.yearOption.version.id;
      const yearToUse = year ?? vehicle.yearOption.year;

      let yearOption = await this.yearOptionRepository.findOne({
        where: {
          year: yearToUse,
          version: { id: versionToUse },
        },
        relations: ['version'],
      });

      if (!yearOption) {
        yearOption = this.yearOptionRepository.create({
          year: yearToUse,
          version: { id: versionToUse },
        });
        await this.yearOptionRepository.save(yearOption);
      }

      vehicle.yearOption = yearOption;
    }

    if (price !== undefined) vehicle.price = price;
    if (mileage !== undefined) vehicle.mileage = mileage;
    if (description !== undefined) vehicle.description = description;

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
