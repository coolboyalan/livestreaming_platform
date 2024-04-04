const validationSchema = require("../validations/validationSchema");
const schemaValidator = function (schema) {
  return function (req, res, next) {
    try {
      const { error } = validationSchema[schema].validate(req.body);
      if (error) {
        throw new Error(error);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = schemaValidator;
