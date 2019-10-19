# Dynamic Module Configuration

## Why

Occasionally you'll come across a use case in NestJS where you want to use a DynamicModule, but you'll only want to worry about the main configuration of that module once (like a `ConfigModule`). One option, of course, is to use the `@Global()` decorator, but if you want to make yourself more conscious about what you import and where, you could use something similar to this repository.

## How

Just like any Dynamic Module in NestJS, we need a static configuration method (and possibly an async one too), whether it is `register` or `forRoot` or whatever else you want to call it. The difference here is that we also need an RxJS `Subject` to be able to keep track of the module configuration without polluting the global scope. After setting up the ability to work with a Dynamic Module you can follow the rest of these steps:

1. Create a private static variable for your RxJS Subject with type of `Subject<DynamicModule>`.
2. Create a private static variable that has a `timeout` function from RxJS and throws an error if the timeout is reached (2.5 seconds is pretty good, but also probably a bit long)
3. Create a public static variable that returns the `race` of the `timeout` and the Subject's next value (hint: there should only be one value in the subject anyways) and returns it as a `Promise<DynamicModule>`
4. In your static configuration methods (`forRoot`, `forRootAsync`, etc.), add the dynamicModuleConfiguration to the class's static RxJS Subject.
5. In your `AppModule` add your configuration for the DynamicModule and in any other module that needs this DynamicModule without re-configuring add the import `DynamicModule.Deferred` or whatever you called the variable that returns the `race` condition.
6. Use the module as normal.

## Example

### Config Module

```ts
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { interval, race, Subject } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { CONFIG_MODULE_OPTIONS } from './config.constants';
import { createConfigProvider } from './config.provider';
import { ConfigService } from './config.service';
import {
  ConfigModuleAsyncOptions,
  ConfigModuleOptions,
  ConfigOptionsFactory,
} from './interfaces/config-options.interface';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  private static moduleSubject = new Subject<DynamicModule>();

  private static timeout$ = interval(2500).pipe(
    first(),
    map(() => {
      throw new Error(
        `Expected Config Service to be configured by at last one Module but it was not configured within 2500ms`,
      );
    }),
  );

  public static Deferred: Promise<DynamicModule> = race(
    ConfigModule.timeout$,
    ConfigModule.moduleSubject.pipe(take(1)),
  ).toPromise();

  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const dynamicConfigModule = {
      module: ConfigModule,
      providers: createConfigProvider(options),
    };

    this.moduleSubject.next(dynamicConfigModule);

    return dynamicConfigModule;
  }

  static forRootAsync(options: ConfigModuleAsyncOptions): DynamicModule {
    const dynamicConfigModule = {
      module: ConfigModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };

    this.moduleSubject.next(dynamicConfigModule);
    return dynamicConfigModule;
  }

  private static createAsyncProviders(
    options: ConfigModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProviders(options)];
    }
    if (options.useClass) {
      return [
        this.createAsyncOptionsProviders(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    throw new Error('Invalid ConfigModule configuration.');
  }

  private static createAsyncOptionsProviders(
    options: ConfigModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CONFIG_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CONFIG_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ConfigOptionsFactory) =>
        await optionsFactory.createConfigOptions(),
      inject: [options.useExisting || options.useClass || ''],
    };
  }
}
```

### App Module

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DyanmicTestModule } from './dyanmic-test/dyanmic-test.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRootAsync({
      useFactory: () => ({
        fileName: '.env',
        useProcess: false,
      }),
    }),
    DyanmicTestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Dynamic Test Module

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DyanmicTestService } from './dyanmic-test.service';
import { DyanmicTestController } from './dyanmic-test.controller';

@Module({
  imports: [ConfigModule.Deferred],
  providers: [DyanmicTestService],
  controllers: [DyanmicTestController],
})
export class DyanmicTestModule {}
```

## Shout-outs

A big thanks to [John Biundo](https://github.com/johnbiundo) and [Jesse Carter](https://github.com/WonderPanda) for working through this issue with me and eventually finding a solution!