import {config} from 'dotenv';
config();
import { Sequelize } from 'sequelize';

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

export default sequelize;
