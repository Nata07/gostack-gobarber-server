import 'dotenv/config';
import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';
import '@shared/infra/typeorm';
import upload from '@config/upload';
import AppError from '../../errors/AppError';
import '@shared/container';

import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(upload.uploadFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});
app.listen(3333, () => {
  console.log(`server on 🚀🚀`);
});
