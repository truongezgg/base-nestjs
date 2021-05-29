export enum ErrorCode {
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Email_Or_Password_Not_valid = 'Email_Or_Password_Not_valid',
  Email_Already_Exist = 'Email_Already_Exist',
  Refresh_Token_Invalid = 'Refresh_Token_Invalid',
  Access_Token_Invalid = 'Access_Token_Invalid',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
}

export enum UserType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum JWTType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Permission {
  CREATE_CAT = 1,
  UPDATE_CAT = 2,
}
