import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  author: Joi.string().min(3).max(255).required(),
  publisher: Joi.string().min(3).max(255).required(),
  year: Joi.number().integer().min(0).required(),
  description: Joi.string().min(5).required(),
  category_id: Joi.string().required(),
});
