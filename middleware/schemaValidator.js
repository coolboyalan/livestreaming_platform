const validationSchema = require("../validations/validationSchema");
const schemaValidator = function (schema) {
  return function (req, res, next) {
    try {
      const { error } = validationSchema[schema].validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = schemaValidator;
