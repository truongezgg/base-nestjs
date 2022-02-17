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

# Remove common lib

1. In src/app/app.module.ts

```Typescript
// Remove CommonModule
import { CommonModule } from '@libs/common';

@Module({
  imports: [..., CommonModule],
  providers: [
    ...
  ],
})
export class AppModule {
  ...
}

```

2. In nest-cli.json

```javascript
// Remove common in projects
{
  projects: {
    ...
    "common": {
      "type": "library",
      "root": "libs/common",
      "entryFile": "index",
      "sourceRoot": "libs/common/src",
      "compilerOptions": {
        "tsConfigPath": "libs/common/tsconfig.lib.json"
      }
    }
  },
  ...
  }
}

```

3. In package.json & tsconfig.json

Remove flowing line.

```javascript
"@libs/common": "...",
"@libs/common/(.*)": "...",
```
