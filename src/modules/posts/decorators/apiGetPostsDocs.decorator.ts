import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ResponsePaginatedPostsDto } from 'src/DTOs/postsDto/responsePaginatedPosts.dto';
import { CurrencyEnum } from 'src/enums/currency.enum';
import { OrderDirectionEnum } from 'src/enums/order.enum';
import { OrderByPostsEnum } from 'src/enums/orderByPosts.enum';
import { VehicleCondition } from 'src/enums/vehicleCondition.enum';
import { VehicleTypeEnum } from 'src/enums/vehicleType.enum';

export const ApiGetPostsDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all posts.' }),
    ApiQuery({ name: 'page', required: false, description: '' }),
    ApiQuery({ name: 'limit', required: false, description: '' }),
    ApiQuery({ name: 'search', required: false, description: '' }),
    ApiQuery({ name: 'brandId', type: [String], required: false, isArray: true }),
    ApiQuery({ name: 'modelId', type: [String], required: false, isArray: true }),
    ApiQuery({ name: 'versionId', type: [String], required: false, isArray: true }),
    ApiQuery({ name: 'typeOfVehicle', enum: VehicleTypeEnum, required: false, isArray: true }),
    ApiQuery({ name: 'condition', required: false, enum: VehicleCondition }),
    ApiQuery({ name: 'currency', required: false, description: '', enum: CurrencyEnum }),
    ApiQuery({ name: 'minYear', required: false, description: '' }),
    ApiQuery({ name: 'maxYear', required: false, description: '' }),
    ApiQuery({ name: 'minPrice', required: false, description: '' }),
    ApiQuery({ name: 'maxPrice', required: false, description: '' }),
    ApiQuery({ name: 'minMileage', required: false, description: '' }),
    ApiQuery({ name: 'maxMileage', required: false, description: '' }),
    ApiQuery({ name: 'orderBy', required: false, description: '', enum: OrderByPostsEnum }),
    ApiQuery({ name: 'order', required: false, description: '', enum: OrderDirectionEnum }),
    ApiResponse({
      status: 200,
      description: 'Vehicles found',
      type: ResponsePaginatedPostsDto,
      example: {
        data: [
          {
            id: '09fe6ac7-1e15-4651-aa51-0991965e31df',
            vehicle: {
              id: '772c5eb6-eb42-4c21-9f67-f65a236bd3a1',
              brand: {
                id: 'b6740ab0-64e3-465e-8c23-5c5b070366f0',
                name: 'HYUNDAI',
              },
              model: {
                id: '58b57157-a9fe-4c79-85e8-eb779c85221e',
                name: 'Veloster',
              },
              version: {
                id: 'b204842f-b4bb-46e6-8c00-f07e958b6a9b',
                name: 'Tech 2.0 AT (150cv)',
              },
              typeOfVehicle: 'SPORTSCAR',
              year: 2014,
              condition: 'new',
              currency: 'AR$',
              price: 1500000000,
              mileage: 0,
              description: 'Muy buen estado, único dueño.',
              photos: [],
            },
            postDate: '2025-05-23T16:27:21.591Z',
            status: 'Active',
          },
          {
            id: '1ecb6d45-0e66-4008-81cf-253680520012',
            vehicle: {
              id: '28e6c702-e0b2-4e7c-af27-35edeacdabab',
              brand: {
                id: 'b6740ab0-64e3-465e-8c23-5c5b070366f0',
                name: 'HYUNDAI',
              },
              model: {
                id: '58b57157-a9fe-4c79-85e8-eb779c85221e',
                name: 'Veloster',
              },
              version: {
                id: 'b204842f-b4bb-46e6-8c00-f07e958b6a9b',
                name: 'Tech 2.0 AT (150cv)',
              },
              typeOfVehicle: 'SPORTSCAR',
              year: 2013,
              condition: 'new',
              currency: 'AR$',
              price: 1500000000,
              mileage: 0,
              description: 'Muy buen estado, único dueño.',
              photos: [],
            },
            postDate: '2025-05-23T16:26:52.719Z',
            status: 'Active',
          },
          {
            id: 'ce000b1e-2277-4b23-9419-3a1da0cd091f',
            vehicle: {
              id: '1b0f3766-1705-40b1-9122-da43f01ca72d',
              brand: {
                id: 'b6740ab0-64e3-465e-8c23-5c5b070366f0',
                name: 'HYUNDAI',
              },
              model: {
                id: '58b57157-a9fe-4c79-85e8-eb779c85221e',
                name: 'Veloster',
              },
              version: {
                id: 'b204842f-b4bb-46e6-8c00-f07e958b6a9b',
                name: 'Tech 2.0 AT (150cv)',
              },
              typeOfVehicle: 'SPORTSCAR',
              year: 2012,
              condition: 'new',
              currency: 'AR$',
              price: 1500000000,
              mileage: 0,
              description: 'Muy buen estado, único dueño.',
              photos: [],
            },
            postDate: '2025-05-23T16:26:19.864Z',
            status: 'Active',
          },
        ],
        total: 15,
        page: 1,
        limit: 3,
        totalPages: 5,
      },
    }),
  );
};
