// import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import '@shared/infra/typeorm';
import upload from '@config/upload';
import AppError from '@shared/errors/AppError';

import '@shared/container';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(upload.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});
app.listen(3333, () => {
  console.log(`server on 🚀🚀`);
});
