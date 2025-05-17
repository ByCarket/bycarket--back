export const paramId = (description: string) => {
  return {
    name: 'id',
    description,
    type: String,
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  };
};
