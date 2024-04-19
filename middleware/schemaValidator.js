const validationSchema = require("../validations/validationSchema");
const schemaValidator = function (schema) {
  return function (req, res, next) {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    } catch (err) {
      console.log(true)
      const error = {
        status:400,
        message:err.message
      }
      res.render('error',error)
    }
  };
};

module.exports = schemaValidator;
