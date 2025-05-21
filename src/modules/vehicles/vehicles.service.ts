import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from 'src/DTOs/vehicleDto/createVehicle.dto';
import { UpdateVehicleDto } from 'src/DTOs/vehicleDto/updateVehicle.dto';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { User } from 'src/entities/user.entity';
import { Version } from 'src/entities/version.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ GET all vehicles paginated
  async getVehicles(page: number, limit: number, userId: string): Promise<Vehicle[]> {
    const skip = (page - 1) * limit;
    return this.vehicleRepository.find({
      skip,
      take: limit,
      relations: ['brand', 'model', 'version'],
      where: {
        user: { id: userId },
      },
    });
  }

  // ✅ GET vehicle by id
  async getVehicleById(id: string, userId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.user && vehicle.user.id !== userId) {
      throw new ForbiddenException(
        `Vehicle with ID ${id} does not belong to user with ID ${userId}`,
      );
    }
    vehicle.user = {
      id: vehicle.user.id,
      name: vehicle.user.name,
      email: vehicle.user.email,
      phone: vehicle.user.phone,
      address: vehicle.user.address,
      city: vehicle.user.city,
      country: vehicle.user.country,
      image: vehicle.user.image,
    } as User;

    return {
      data: vehicle,
      message: 'Vehicle found',
    };
  }

  // ✅ CREATE vehicle
  async createVehicle(createVehicleDto: CreateVehicleDto, userId: string){
    const { brandId, modelId, versionId, year, price, mileage, description, typeOfVehicle, condition, currency } = createVehicleDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const brand = await this.brandRepository.findOneBy({ id: brandId });
    const model = await this.modelRepository.findOneBy({ id: modelId });
    const version = await this.versionRepository.findOneBy({ id: versionId });

    if (!brand) throw new NotFoundException(`Brand with ID ${brandId} not found`);
    if (!model) throw new NotFoundException(`Model with ID ${modelId} not found`);
    if (!version) throw new NotFoundException(`Version with ID ${versionId} not found`);

    const vehicle = this.vehicleRepository.create({
      brand,
      model,
      version,
      year,
      price,
      mileage,
      description,
      user,
      typeOfVehicle,
      condition,
      currency,
    });
    const savedVehicle = await this.vehicleRepository.save(vehicle);
    savedVehicle.user = { 
      id: savedVehicle.user.id,
      name: savedVehicle.user.name,
      email: savedVehicle.user.email,
    } as User;

    return { data: savedVehicle, message: 'Vehicle created successfully.' };
  }

  // ✅ UPDATE vehicle
  async updateVehicle(id: string, userId: string, updateVehicleInfo: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['brand', 'model', 'version'],
    });

    if (!vehicle) throw new NotFoundException(`Vehicle with ID ${id} not found`);
    if (vehicle.user && vehicle.user.id !== userId) {
      throw new ForbiddenException(
        `Vehicle with ID ${id} does not belong to user with ID ${userId}`,
      );
    }

    const { brandId, modelId, versionId, year, price, mileage, description, typeOfVehicle, condition, currency } = updateVehicleInfo;

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
    if (versionId) {
      const version = await this.versionRepository.findOneBy({ id: versionId });
      if (!version) throw new NotFoundException(`Version with ID ${versionId} not found`);
      vehicle.version = version;
    }

    vehicle.year = year ? year : vehicle.year;
    vehicle.price = price ? price : vehicle.price;
    vehicle.mileage = mileage ? mileage : vehicle.mileage;
    vehicle.typeOfVehicle = typeOfVehicle ? typeOfVehicle : vehicle.typeOfVehicle;
    vehicle.condition = condition ? condition : vehicle.condition;
    vehicle.currency = currency ? currency : vehicle.currency;
    vehicle.description = description ? description : vehicle.description;

    return this.vehicleRepository.save(vehicle);
  }

  // ✅ DELETE vehicle
  async deleteVehicle(id: string, userId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.user && vehicle.user.id !== userId) {
      throw new ForbiddenException(
        `Vehicle with ID ${id} does not belong to user with ID ${userId}`,
      );
    }
    await this.vehicleRepository.delete(id);

    return {
      data: id,
      message: `Vehicle deleted successfully`,
    };
  }
}
