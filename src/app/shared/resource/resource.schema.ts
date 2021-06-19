export const listResourceSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    pageIndex: {
      type: 'integer',
      minimum: 1,
    },
    take: {
      type: 'integer',
      minimum: 1,
    },
    start: {
      type: 'integer',
    },
    skip: {
      type: 'integer',
    },
    sort: {
      type: 'string',
    },
    keyword: {
      type: 'string',
      maxLength: 250,
    },
    status: {
      type: 'string',
      enum: ['', '1', '0'],
    },
    type: {
      pattern: '^$|^\\d+$',
    },
  },
};

export const addResourceSchema: AjvSchema = {
  type: 'object',
  required: ['name', 'type'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    type: {
      type: 'number',
    },
    order: {
      type: 'number',
    },
    status: {
      type: 'number',
    },
    value: {
      type: 'string',
    },
  },
};

export const updateResourceSchema: AjvSchema = {
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
    order: {
      type: ['number'],
    },
  },
};

export const updateStatusResourceSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    status: {
      type: 'number',
    },
  },
};

export const createResourceSingleSchema: AjvSchema = {
  type: 'object',
  required: ['type', 'value'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
    },
    value: {
      type: 'string',
    },
    type: {
      type: 'number',
    },
    order: {
      type: 'number',
    },
    status: {
      type: 'number',
    },
  },
};
