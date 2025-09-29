import { User } from '../models';
import { generateToken } from '../utils/jwt';
import { expect, describe, beforeEach, it} from '@jest/globals';
import jwt from 'jsonwebtoken';

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('User Registration', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await User.create(userData);

      // Validar campos obrigatórios
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);

      // Senha deve ser hash
      expect(user.password).not.toBe(userData.password);
    });

    it('should validate password correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(await user.validatePassword('password123')).toBe(true);
      expect(await user.validatePassword('wrongpassword')).toBe(false);
    });

    it('should throw an error if username is missing', async () => {
      await expect(
        User.create({
          email: 'a@b.com', password: '123',
          username: ''
        })
      ).rejects.toThrow();
    });

    it('should throw an error if username is empty', async () => {
      await expect(
        User.create({ username: 'abc', email: 'invalid-email', password: '123' })
      ).rejects.toThrow();
    });
  });


  describe('JWT Token', () => {
    it('should generate a token string', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should encode and decode payload correctly', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = generateToken(payload);

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.username).toBe(payload.username);
    });
  });
});
