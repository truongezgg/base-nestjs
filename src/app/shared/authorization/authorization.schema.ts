export const addRoleSchema = {
  type: 'object',
  required: ['roleName'],
  additionalProperties: false,
  properties: {
    roleName: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
} as AjvSchema;

export const updateRoleSchema = {
  type: 'object',
  required: ['roleName'],
  additionalProperties: false,
  properties: {
    roleName: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
} as AjvSchema;

export const updateRolePermissionsSchema = {
  type: 'object',
  required: ['permissions', 'changeUserPermission'],
  additionalProperties: false,
  properties: {
    permissions: {
      type: 'array',
      items: {
        type: 'number',
        minimum: 1,
        maximum: 998,
      },
      minItems: 0,
    },
    changeUserPermission: {
      enum: [0, 1],
    },
  },
} as AjvSchema;
