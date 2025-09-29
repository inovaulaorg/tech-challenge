import { describe, beforeEach, it, expect } from '@jest/globals';
import { User } from '../models';
import { generateToken } from '../utils/jwt';


describe('Auth Controller', () => {
  //Limpa o banco de dados antes de cada teste para garantir o isolamento
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
      
      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      
      // Crucialmente, verifica se a senha não está armazenada em texto plano
      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(userData.password.length); // Senhas hasheadas são mais longas
    });

    it('should validate password correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      
      const isValid = await user.validatePassword('password123');
      const isInvalid = await user.validatePassword('wrongpassword');
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });

    //Esta é a versão corrigida do teste intencionalmente quebrado
    it('should create an user with correct username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      
      // Assertion Corrigida: O nome de usuário deve corresponder aos dados fornecidos.
      expect(user.username).toBe(userData.username);
    });
  });

  describe('JWT Token', () => {
    it('should generate and verify token correctly', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); //Um JWT válido tem três partes
    });

    //Esta é a versão corrigida do teste JWT intencionalmente quebrado
    it('should confirm token is not undefined', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = generateToken(payload);
      
      //Assertion Corrigida: Um token gerado com sucesso não deve ser indefinido.
      expect(token).not.toBeUndefined();
    });
  });
});

