const Joi = require("joi");

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  isAdult: Joi.boolean().required(),
  category: Joi.string().valid("creator", "studio", "viewer").required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(2).required(),
});

const additionalDetailsSchema = Joi.object({
  contentCategory: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  sex: Joi.string().valid("Male", "Female", "Others").required(),
  nativeLanguage: Joi.string().required(),
  dob: Joi.date().required(), //
  governmentIdNo: Joi.string(),
  governmentIdExpiryDate: Joi.date(),
  country: Joi.string().required(),
  city: Joi.string(),
  state: Joi.string(),
  postalCode: Joi.string(),
  address: Joi.string(),
  companyName: Joi.string(),
  taxNo: Joi.string(),
  businessRegistrationNo: Joi.string(),
});

module.exports = {
  registrationSchema,
  additionalDetailsSchema,
  loginSchema,
};
