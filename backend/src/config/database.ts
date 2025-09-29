import { Sequelize } from 'sequelize';

// Validação de variáveis essenciais
const requiredEnv = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_PORT',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// Pool otimizado
const pool = {
  max: process.env.NODE_ENV === 'production' ? 20 : 10,
  min: process.env.NODE_ENV === 'production' ? 2 : 0,
  acquire: 30000,
  idle: 10000,
  evict: 10000,
};

// SSL condicional para produção
const dialectOptions =
  process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool,
  dialectOptions,
});

export { sequelize };
