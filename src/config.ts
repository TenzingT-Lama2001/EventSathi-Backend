import './dotenv-init';

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

export const DB = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const JWT = {
  secret: process.env.JWT_SECRET!,
};

export const SMTP_INFO = {
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
};
