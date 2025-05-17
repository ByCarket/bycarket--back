import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';
import { Model } from '../../entities/model.entity';
import { Version } from '../../entities/version.entity';
import * as data from '../../assets/marcas_modelos_versiones_acara.json';
import { DataSeeder } from 'src/interfaces/dataSeeder.interface';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Model) private modelRepo: Repository<Model>,
    @InjectRepository(Version) private versionRepo: Repository<Version>,
  ) {}

  async seedBrands() {
    const uniqueBrands = new Set((data as DataSeeder[]).map(item => item.marca));
    for (const name of uniqueBrands) {
      const exists = await this.brandRepo.findOne({ where: { name } });
      if (!exists) {
        await this.brandRepo.save(this.brandRepo.create({ name }));
      }
    }
    return { message: 'Brands seeded successfully' };
  }

  async seedModels() {
    for (const item of data as DataSeeder[]) {
      const brand = await this.brandRepo.findOne({ where: { name: item.marca } });
      if (!brand) continue;

      const exists = await this.modelRepo.findOne({ where: { name: item.modelo } });
      if (!exists) {
        await this.modelRepo.save(this.modelRepo.create({ name: item.modelo, brand }));
      }
    }
    return { message: 'Models seeded successfully' };
  }

  async seedVersions() {
    for (const item of data as DataSeeder[]) {
      const model = await this.modelRepo.findOne({ where: { name: item.modelo } });
      if (!model) continue;

      if (!item.versiones || item.versiones.length === 0) continue;

      for (const versionName of item.versiones) {
        const exists = await this.versionRepo.findOne({
          where: { name: versionName, model: { id: model.id } },
        });
        if (!exists) {
          await this.versionRepo.save(this.versionRepo.create({ name: versionName, model }));
        }
      }
    }
    return { message: 'Versions seeded successfully' };
  }
}
