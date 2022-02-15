# Overview

- Manage config from CMS by key - value

# Dependency

No

# Implement

1. Clone code into shared folder(src/app/shared)

   `git clone git@git.amela.vn:hades-base/nestjs-api/config.git ./src/app/shared/config`

2. import and export ConfigModule in file src/app/shared/shared.module.ts

```Typescript

...

import { ConfigModule } from './config/config.module';

@Module({
  imports: [..., ConfigModule],
  controllers: [],
  exports: [..., ConfigModule],
})
export class SharedModule {}

```

```bash
# Run migration to change database
$ npm run migration:run
```
