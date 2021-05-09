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
  USER = 1,
}

export enum JWTType {
  ACCESS_TOKEN = 1,
  REFRESH_TOKEN = 2,
}
