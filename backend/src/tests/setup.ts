import dotenv from 'dotenv';
import path from 'path';

// Carrega .env no setup dos testes
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { sequelize } from '../config/database';

// Setup test database
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Clean up after tests
afterAll(async () => {
  await sequelize.close();
});
