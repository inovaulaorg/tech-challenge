import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({ 
        error: 'Validation error',
        message: errorMessage,
        details: error.details 
      });
      return;
    }
    
    next();
  };
};

const passwordValidation = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.pattern.base': 'Password must contain at least: 1 lowercase, 1 uppercase, 1 number, 1 special character'
  })
  .required();

  const usernameValidation = Joi.string()
  .min(3)
  .max(30)
  .pattern(/^[a-zA-Z0-9][a-zA-Z0-9_-]{1,28}[a-zA-Z0-9]$/) // ✅ Não pode começar/terminar com _ ou -
  .messages({
    'string.pattern.base': 'Username must start and end with alphanumeric characters'
  })
  .required();

const emailValidation = Joi.string()
  .email({ 
    minDomainSegments: 2, // ✅ Exige domínio válido
    tlds: { allow: ['com', 'org', 'net', 'edu', 'gov', 'br', 'co'] } // ✅ Lista de TLDs permitidos
  })
  .lowercase() // ✅ Converte para minúsculo
  .trim()
  .required();

// User validation schemas
export const registerSchema = Joi.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  firstName: Joi.string()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .trim()
    .optional(),
  lastName: Joi.string()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .trim()
    .optional(),
});

export const loginSchema = Joi.object({
  email: emailValidation,
  password: Joi.string().required(),
});

// Post validation schemas
export const createPostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .pattern(/^(?!.*<script).*$/)
    .trim()
    .required(),
  content: Joi.string()
    .min(1)
    .max(50000)
    .required(),
  excerpt: Joi.string()
    .max(300)
    .trim()
    .optional(),
  imageUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional(),
  tags: Joi.array()
    .items(Joi.string().max(50).trim())
    .max(10)
    .optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .pattern(/^(?!.*<script).*$/)
    .trim()
    .optional(),
  content: Joi.string()
    .min(1)
    .max(50000)
    .optional(),
  excerpt: Joi.string()
    .max(300)
    .trim()
    .optional(),
  imageUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional(),
  tags: Joi.array()
    .items(Joi.string().max(50).trim())
    .max(10)
    .optional(),
});

// Comment validation schemas
export const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .pattern(/^(?!.*<script).*$/)
    .trim()
    .required(),
  postId: Joi.number().integer().positive().required(),
  parentId: Joi.number().integer().positive().optional(),
});