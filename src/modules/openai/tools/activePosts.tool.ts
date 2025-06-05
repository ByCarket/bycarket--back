export const getActivePostsTool = {
  type: 'function' as const,
  function: {
    name: 'get_active_posts',
    description: 'Obtiene todos los posteos de vehículos que estén actualmente activos.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
};
