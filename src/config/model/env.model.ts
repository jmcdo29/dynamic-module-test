import * as Joi from '@hapi/joi';

export const envVarSchema = Joi.object({
  TEST_STRING: Joi.string(),
});
