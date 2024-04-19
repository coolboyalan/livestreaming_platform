const Joi = require("joi");

const creatorSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  isAdult: Joi.boolean().required(),
  category: Joi.string().valid("creator").required(),
  "confirm-password": Joi.string(),
});

const studioSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  isAdult: Joi.boolean().required(),
  category: Joi.string().valid("studio").required(),
  "confirm-password": Joi.string(),
});

const viewerSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  isAdult: Joi.boolean().required(),
  category: Joi.string().valid("viewer").required(),
});

const viewerLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(2).required(),
  category: Joi.string().valid("viewer"),
});

const creatorLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(2).required(),
  category: Joi.string().valid("creator"),
});

const studioLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(2).required(),
  category: Joi.string().valid("studio"),
});

const additionalDetailsSchema = Joi.object({
  contentCategory: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  sex: Joi.string().valid("Male", "Female", "Others").required(),
  nativeLanguage: Joi.string().required(),
  profilePicture: Joi.any().optional(),
  dob: Joi.date().required(), //
  governmentIdNo: Joi.string().required(),
  governmentIdExpiryDate: Joi.date().optional(),
  country: Joi.string().required(),
  city: Joi.string(),
  state: Joi.string(),
  postalCode: Joi.string(),
  address: Joi.string(),
  companyName: Joi.string(),
  taxNo: Joi.string(),
  businessRegistrationNo: Joi.string(),
  expiryDate:Joi.date(),
});

const studioSchema = Joi.object({
  contentCategory: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  studioName: Joi.string(),
  studioUrl: Joi.string().uri(),
  accountOwner: Joi.string().valid("Individual", "Company"),
  additionalContact: Joi.string(),
  companyName: Joi.string(),
  email: Joi.string().email().required(),
  profilePicture: Joi.string(),
  sex: Joi.string().valid("Male", "Female", "Others").required(),
  category: Joi.string().valid("studio").required(),
  nativeLanguage: Joi.string().required(),
  dob: Joi.date().required(),
  governmentIdNo: Joi.string(),
  idPhoto: Joi.string(),
  idVerificationPhoto: Joi.string(),
  country: Joi.string().required(),
  countryOfResidence: Joi.string().required(),
  city: Joi.string(),
  state: Joi.string(),
  postalCode: Joi.string(),
  address: Joi.string(),
  companyName: Joi.string(),
  taxNo: Joi.string().max(2000),
  businessRegistrationNo: Joi.string(),
});

module.exports = {
  creatorSignUpSchema,
  viewerSignUpSchema,
  studioSignUpSchema,
  additionalDetailsSchema,
  creatorLoginSchema,
  viewerLoginSchema,
  studioLoginSchema,
  studioSchema,
};
