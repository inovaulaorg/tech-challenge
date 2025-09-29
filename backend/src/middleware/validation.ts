import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

//Função de middleware genérica para validar o corpo da requisição contra um schema Joi
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    //valida o corpo da requisição.
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if (error) {
      // caso a validação falhe, formata uma mensagem de erro
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({ 
        error: 'Validation error',
        message: errorMessage,
      });
      return;
    }
    
    // Se a validação for bem-sucedida, prossegue para o controlador
    next();
  };
};

// Schemas de validação de utilizador
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_-]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
  firstName: Joi.string().max(100).allow('').optional(),
  lastName: Joi.string().max(100).allow('').optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Schemas de validação de post
export const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).max(50000).required(),
  excerpt: Joi.string().max(500).allow('').optional(),
  imageUrl: Joi.string().uri().allow('').optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  content: Joi.string().min(1).max(50000).optional(),
  excerpt: Joi.string().max(500).allow('').optional(),
  imageUrl: Joi.string().uri().allow('').optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
});

// Schemas de validação de comentário
export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  postId: Joi.number().integer().positive().required(),
  parentId: Joi.number().integer().positive().optional().allow(null),
});

// Schema específico para atualizar um comentário, onde apenas o conteúdo é editável.
export const updateCommentSchema = Joi.object({
    content: Joi.string().min(1).max(5000).required(),
});

