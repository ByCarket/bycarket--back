export const queryPosts = {
  type: 'function'as const,
  function: {
    name: 'query_posts',
    description: 'Consulta a la base de datos de posts para usarla en la respuesta a la consulta que el usuario haga sobre posts.',
    parameters: {
      type: 'object',
      required: ['user_id', 'status', 'page', 'limit'],
      properties: {
        user_id: {
          type: 'string',
          description: 'El identificador único del usuario que realiza la consulta'
        },
        status: {
          type: 'string',
          description: 'El estado del post que se desea filtrar',
          enum: ['PENDING', 'APPROVED', 'REJECTED']
        },
        page: {
          type: 'number',
          description: 'Número de página para paginación de resultados'
        },
        limit: {
          type: 'number',
          description: 'Número máximo de posts a retornar en la consulta'
        }
      },
      additionalProperties: false
    }
  }
};

