export enum ErrorCode {
  // Common error
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Not_Found = 'Not_Found',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
  Unauthorized = 'Unauthorized',

  Email_Already_Exist = 'Email_Already_Exist',
  Email_Or_Password_Not_valid = 'Email_Or_Password_Not_valid',
  Resource_Already_Exists = 'Resource_Already_Exists',
  Can_Not_Disable_Default_language = 'Can_Not_Disable_Default_language',
}

export enum UserType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Permissions {
  PERMISSION_MANAGEMENT = 1,
  CONFIG_MANAGEMENT = 2,
  RESOURCE_MANAGEMENT = 3,
  LANGUAGE_MANAGEMENT = 4,
}

export enum CommonStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  NOT_VERIFY = 2,
  REJECTED = 3,
}

export enum ResourceType {
  TERM = 1,
  POLICY = 2,
  HELP = 3,
}
