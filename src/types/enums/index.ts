export enum ErrorCode {
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Not_Found = 'Not_Found',
  Email_Or_Password_Not_valid = 'Email_Or_Password_Not_valid',
  Email_Already_Exist = 'Email_Already_Exist',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
  Unauthorized = 'Unauthorized',
  Resource_Already_Exists = 'Resource_Already_Exists',
}

export enum UserType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
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
