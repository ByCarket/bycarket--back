// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Param,
//   Body,
//   ParseUUIDPipe,
//   UseGuards,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiNotFoundResponse,
//   ApiBearerAuth,
// } from '@nestjs/swagger';
// import { YearOptionsService } from './year-options.service';
// import { CreateYearOptionDto } from 'src/dto/vehicleDto/create-year-option.dto';
// import { UpdateYearOptionDto } from 'src/dto/vehicleDto/update-year-option.dto';
// import { YearOption } from 'src/entities/year.entity';
// import { AuthGuard } from 'src/guards/auth.guard';
// import { Roles } from 'src/decorators/roles.decorator';
// import { Role } from 'src/enums/roles.enum';
// import { RolesGuard } from 'src/guards/roles.guard';

// @ApiTags('YearOptions')
// @Controller('year-options')
// @ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
// export class YearOptionsController {
//   constructor(private readonly service: YearOptionsService) {}

//   @Get()
//   @ApiOperation({ summary: 'Obtener todos los registros de YearOption' })
//   @ApiResponse({ status: 200, description: 'Lista de YearOptions' })
//   findAll(): Promise<YearOption[]> {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtener un YearOption por ID' })
//   @ApiResponse({ status: 200, description: 'YearOption encontrado' })
//   @ApiNotFoundResponse({ description: 'YearOption no encontrado' })
//   findOne(@Param('id', ParseUUIDPipe) id: string): Promise<YearOption> {
//     return this.service.findOne(id);
//   }

//   @Get('version/:versionId')
//   @ApiOperation({ summary: 'Obtener años disponibles por versión' })
//   @ApiResponse({
//     status: 200,
//     description: 'Lista de YearOptions encontrados para esa versión',
//   })
//   @ApiNotFoundResponse({ description: 'Versión no encontrada' })
//   findByVersion(@Param('versionId', ParseUUIDPipe) versionId: string): Promise<YearOption[]> {
//     return this.service.findByVersion(versionId);
//   }

//   @Post()
//   @ApiOperation({ summary: 'Crear un nuevo YearOption' })
//   @ApiResponse({ status: 201, description: 'YearOption creado exitosamente' })
//   create(@Body() dto: CreateYearOptionDto): Promise<YearOption> {
//     return this.service.create(dto);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Actualizar un YearOption existente' })
//   @ApiResponse({ status: 200, description: 'YearOption actualizado' })
//   @ApiNotFoundResponse({ description: 'YearOption no encontrado' })
//   update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() dto: UpdateYearOptionDto,
//   ): Promise<YearOption> {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Eliminar un YearOption' })
//   @ApiResponse({ status: 200, description: 'YearOption eliminado' })
//   @ApiNotFoundResponse({ description: 'YearOption no encontrado' })
//   delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
//     return this.service.delete(id);
//   }
// }
