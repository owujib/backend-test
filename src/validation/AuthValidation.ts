import JOI from 'joi';

/**
 * @param data data to be validated
 * @description method is responsible for validating incoming request made
 *  to the server for user registration
 *  @name RegistrationValidation
 */
export const RegistrationValidation = (data: object) => {
  const schema = JOI.object({
    fullname: JOI.string().required().messages({
      'string.required': '{{#label}} is required can not be left empty',
    }),
    email: JOI.string().required().email().messages({
      'string.required': '{{#label}} is required can not be left empty',
      'string.email': '{{#lebel}} is not a valid email',
    }),
    password: JOI.string().required().min(6).max(12)
      .messages({
        'string.required': '{{#label}} is required can not be left empty',
        'string.min': '{{#lebel}} can not be less than 11 characters',
        'string.max': '{{#lebel}} can not be more than 13 characters',
      }),
  });
  return schema.validate(data);
};

/**
 * @param data data to be validated
 * @description method is responsible for validating incoming request made
 *  to the server for user login
 */
export const LoginValidation = (data: object) => {
  const schema = JOI.object({
    email: JOI.string().required().email().messages({
      'string.required': '{{#label}} is required can not be left empty',
      'string.email': '{{#lebel}} is not a valid email',
    }),
    password: JOI.string().required().min(6).max(12)
      .messages({
        'string.required': '{{#label}} is required can not be left empty',
        'string.min': '{{#lebel}} can not be less than 11 characters',
        'string.max': '{{#lebel}} can not be more than 13 characters',
      }),
  });
  return schema.validate(data);
};
