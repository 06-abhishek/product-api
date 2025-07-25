const Joi = require("joi");

exports.productValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required(),
  category: Joi.string().required(),
});
