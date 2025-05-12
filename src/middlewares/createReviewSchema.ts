import Joi from 'joi';

export const createReviewSchema = Joi.object({
  content: Joi.string().required().min(10).max(500).messages({
    'string.empty': 'Review content cannot be empty',
    'string.min': 'Review content must be at least 10 characters long',
    'string.max': 'Review content cannot exceed 500 characters',
    'any.required': 'Review content is required',
  }),
  rating: Joi.number().required().min(1).max(5).messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required',
  }),
  productId: Joi.number().required().messages({
    'number.base': 'Product ID must be a number',
    'any.required': 'Product ID is required',
  }),
});
