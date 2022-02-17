export const updateConfigSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    value: {
      type: 'string',
    },
    type: {
      type: 'string',
      maxLength: 50,
    },
    order: {
      type: 'number',
    },
    metadata: {
      type: 'string',
    },
    isSystem: {
      type: 'number',
    },
  },
};
