import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CONFIG_MODULE_OPTIONS } from './config.constants';
import { ConfigModuleOptions } from './interfaces/config-options.interface';
import { envVarSchema } from './model/env.model';

export interface EnvConfig {
  TEST_STRING: string;
}

@Injectable()
export class ConfigService {
  private envConfig: EnvConfig;

  constructor(
    @Inject(CONFIG_MODULE_OPTIONS)
    options: ConfigModuleOptions,
  ) {
    if (!options.useProcess && !options.fileName) {
      throw new Error(
        'Missing configuration options.' +
          ' If using process.env variables, please mark useProcess as "true".' +
          ' Otherwise, please provide and env file.',
      );
    }
    let config: { [key: string]: any };
    if (options.fileName) {
      config = parse(
        readFileSync(join(process.env.PWD as string, options.fileName)),
      );
    } else {
      config = process.env;
    }
    this.envConfig = this.validateConfig(config);
  }

  private validateConfig(config: { [key: string]: any }): EnvConfig {
    const { error, value: validatedEnvConfig } = envVarSchema.validate(config, {
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig as EnvConfig;
  }

  getTestString(): string {
    return this.envConfig.TEST_STRING;
  }
}
