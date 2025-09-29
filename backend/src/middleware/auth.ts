import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload } from '../types';
import { User } from '../models';

//Se o segredo JWT não estiver definido nas variáveis de ambiente,
//a aplicação irá falhar ao iniciar, prevenindo a execução insegura
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}
const JWT_SECRET = process.env.JWT_SECRET;

//middleware para proteger rotas que exigem autenticação
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token is required. No token provided.' });
    return;
  }

  try {
    // removido o segredo de recurso. Agora usa a variável segura
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Verifica se o utilizador associado ao token ainda existe e está ativo
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Authentication failed. User not found or inactive.' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// middleware para rotas públicas que podem ter funcionalidades extra para utilizadores autenticados.
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

  if (!token) {
    return next(); //continua sem um utilizador se não houver token
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    const user = await User.findByPk(decoded.id);
    if (user && user.isActive) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      };
    }
  } catch (error) {
    // Falha silenciosamente, pois a autenticação é opcional.
  }

  next();
};

