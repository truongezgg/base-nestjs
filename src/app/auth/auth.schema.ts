export const loginSchema: AjvSchema = {
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

export const registerSchema: AjvSchema = {
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

export const requestAccessTokenSchema: AjvSchema = {
  type: 'object',
  required: ['refreshToken'],
  additionalProperties: false,
  properties: {
    refreshToken: {
      type: 'string',
      minLength: 1,
    },
  },
};
