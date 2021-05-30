export const adminLoginSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: {
      format: 'email',
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 32,
    },
  },
};

export const adminRegisterSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: {
      format: 'email',
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 32,
    },
  },
};
