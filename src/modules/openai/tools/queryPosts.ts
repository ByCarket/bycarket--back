export const queryPosts = {
  type: 'function' as const,
  function: {
    name: 'get_vehicle_details', // ¡Cambio para que coincida con la llamada en el service!
    description: 'Obtiene todos los detalles de un vehículo específico por su postId.',
    parameters: {
      type: 'object',
      properties: {
        post_id: {
          type: 'string',
          description: 'El ID del post del vehículo',
        },
      },
      required: ['post_id'],
      additionalProperties: false,
    },
  },
};