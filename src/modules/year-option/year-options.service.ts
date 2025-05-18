// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { YearOption } from 'src/entities/year.entity';
// import { Version } from 'src/entities/version.entity';
// import { CreateYearOptionDto } from 'src/dto/vehicleDto/create-year-option.dto';
// import { UpdateYearOptionDto } from 'src/dto/vehicleDto/update-year-option.dto';


// @Injectable()
// export class YearOptionsService {
//     constructor(
//         @InjectRepository(YearOption)
//         private readonly yearOptionRepository: Repository<YearOption>,
//         @InjectRepository(Version)
//         private readonly versionRepository: Repository<Version>,
//     ) {}


//     findAll(): Promise<YearOption[]> {
//         return this.yearOptionRepository.find({ relations: ['version'] });
//     }


//     async findOne(id: string): Promise<YearOption> {
//         const yearOption = await this.yearOptionRepository.findOne({
//             where: { id },
//             relations: ['version'],
//         });
//         if (!yearOption) throw new NotFoundException(`YearOption with ID ${id} not found`);
//         return yearOption;
//     }
//     async findByVersion(versionId: string): Promise<YearOption[]> {
//   const version = await this.versionRepository.findOneBy({ id: versionId });
//   if (!version) throw new NotFoundException(`Version with ID ${versionId} not found`);


//   return this.yearOptionRepository.find({
//     where: { version: { id: versionId } },
//     relations: ['version'],
//     order: { year: 'DESC' },
//   });
// }




//     async create(dto: CreateYearOptionDto): Promise<YearOption> {
//         const version = await this.versionRepository.findOneBy({ id: dto.versionId });
//         if (!version) throw new NotFoundException(`Version with ID ${dto.versionId} not found`);


//         const yearOption = this.yearOptionRepository.create({
//             year: dto.year,
//             version,
//         });


//         return this.yearOptionRepository.save(yearOption);
//     }


//     async update(id: string, dto: UpdateYearOptionDto): Promise<YearOption> {
//         const yearOption = await this.findOne(id);


//         if (dto.versionId) {
//             const version = await this.versionRepository.findOneBy({ id: dto.versionId });
//             if (!version) throw new NotFoundException(`Version with ID ${dto.versionId} not found`);
//             yearOption.version = version;
//         }


//         if (dto.year !== undefined) yearOption.year = dto.year;


//         return this.yearOptionRepository.save(yearOption);
//     }


//     async delete(id: string): Promise<void> {
//         const result = await this.yearOptionRepository.delete(id);
//         if (result.affected === 0) throw new NotFoundException(`YearOption with ID ${id} not found`);
//     }
// }


