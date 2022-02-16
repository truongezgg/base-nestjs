# Overview

- Manage config from CMS by key - value

# Dependency

1. Authorization module

## ErrorCode

```Typescript
export enum ErrorCode {
  ...
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Not_Found = 'Not_Found',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
  Unauthorized = 'Unauthorized',
  ...
}
```

# Implement

1. Clone code into shared folder(libs)

   `git clone git@git.amela.vn:hades-base/nestjs-api/config.git ./libs/config`

2. import ConfigModule and ConfigService to use

```Typescript

// In Module file.
import { ConfigModule, ConfigService } from '@app/config';

@Module({
  imports: [..., ConfigModule],
  controllers: [...],
  exports: [...],
})
export class ExampleModule {}
```

```Typescript

// In Service file
import { ConfigService } from '@app/config';

@Injectable()
export class ExampleService {
  constructor(private configService: ConfigService, ...) {}
  ...
}

```

```bash
# Run migration to change database
$ npm run migration:run
```
