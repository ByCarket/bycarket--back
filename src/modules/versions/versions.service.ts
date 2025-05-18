import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Version } from 'src/entities/version.entity';
import { Model } from 'src/entities/model.entity';
import { CreateVersionDto } from 'src/DTOs/vehicleDto/seederDto/create-version.dto';
import { UpdateVersionDto } from 'src/DTOs/vehicleDto/seederDto/update-version.dto';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async findAll(): Promise<Version[]> {
    return await this.versionRepository.find({ relations: ['model'] });
  }

  async findOne(id: string): Promise<Version> {
    const version = await this.versionRepository.findOne({
      where: { id },
      relations: ['model'],
    });
    if (!version) throw new NotFoundException(`Version with ID ${id} not found`);
    return version;
  }

  async create(dto: CreateVersionDto): Promise<Version> {
    const model = await this.modelRepository.findOneBy({ id: dto.modelId });
    if (!model) throw new NotFoundException(`Model with ID ${dto.modelId} not found`);

    const version = this.versionRepository.create({
      name: dto.name,
      model,
    });

    return this.versionRepository.save(version);
  }

  async update(id: string, dto: UpdateVersionDto): Promise<Version> {
    const version = await this.findOne(id);

    if (dto.modelId) {
      const model = await this.modelRepository.findOneBy({ id: dto.modelId });
      if (!model) throw new NotFoundException(`Model with ID ${dto.modelId} not found`);
      version.model = model;
    }

    if (dto.name !== undefined) version.name = dto.name;

    return this.versionRepository.save(version);
  }

  async delete(id: string): Promise<void> {
    const result = await this.versionRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Version with ID ${id} not found`);
  }
}
