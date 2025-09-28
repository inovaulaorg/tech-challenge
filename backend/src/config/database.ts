import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTestEnvironment = typeof process.env.JEST_WORKER_ID !== 'undefined' || process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
  database:
    (isTestEnvironment
      ? process.env.DB_NAME_TEST || process.env.DB_NAME
      : process.env.DB_NAME) || 'tech_challenge_blog',
  username:
    (isTestEnvironment
      ? process.env.DB_USER_TEST || process.env.DB_USER
      : process.env.DB_USER) || 'admin',
  password:
    (isTestEnvironment
      ? process.env.DB_PASSWORD_TEST || process.env.DB_PASSWORD
      : process.env.DB_PASSWORD) || 'password123',
  host:
    (isTestEnvironment ? process.env.DB_HOST_TEST : process.env.DB_HOST) ||
    (isTestEnvironment ? 'localhost' : 'localhost'),
  port: parseInt(
    (isTestEnvironment
      ? process.env.DB_PORT_TEST || process.env.DB_PORT
      : process.env.DB_PORT) || '5432'
  ),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Intentional performance issue: missing connection pool optimization
  dialectOptions: {
    // Missing SSL configuration for production
    ...(process.env.NODE_ENV === 'production' && {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    })
  }
});

export { sequelize };
