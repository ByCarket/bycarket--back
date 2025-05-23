import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiGetPostsDocs = () => {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, description: '' }),
    ApiQuery({ name: 'limit', required: false, description: '' }),
    ApiQuery({ name: 'search', required: false, description: '' }),
    ApiQuery({ name: 'brandId', required: false, description: '' }),
    ApiQuery({ name: 'modelId', required: false, description: '' }),
    ApiQuery({ name: 'versionId', required: false, description: '' }),
    ApiQuery({ name: 'typeOfVehicle', required: false, description: '' }),
    ApiQuery({ name: 'condition', required: false, description: '' }),
    ApiQuery({ name: 'currency', required: false, description: '' }),
    ApiQuery({ name: 'minYear', required: false, description: '' }),
    ApiQuery({ name: 'maxYear', required: false, description: '' }),
    ApiQuery({ name: 'minPrice', required: false, description: '' }),
    ApiQuery({ name: 'maxPrice', required: false, description: '' }),
    ApiQuery({ name: 'minMileage', required: false, description: '' }),
    ApiQuery({ name: 'maxMileage', required: false, description: '' }),
  );
};
