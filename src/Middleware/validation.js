import Joi from "joi";
import { AppError } from "../utils/ErrorHandling.js";



export const generalFieldes = {
  name: Joi.string(),
//   email:,
//   phone:,
//   password:
}



export const isValid = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.parmas, ...req.query };
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errArr = error.details.map((err) => err.message);
      return next(new AppError(errArr.join(", "), 400));
    }
    next()
  };
};