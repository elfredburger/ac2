import Joi from "joi";
const create = Joi.object({
  email: Joi.string().max(30).email().required(),
  password: Joi.string().required().min(6),
});
const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export default { create, login };
