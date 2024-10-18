import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '@common/utils/logger';
import AppException from '@common/exceptions/AppException';
import { HttpStatus } from '@common/utils/systemConstants';
import { v4 as uuidv4 } from 'uuid';
import httpContext from 'express-http-context';
import routes from '@common/http/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(httpContext.middleware);
app.use(routes);

app.use(function (req, res, next) {
  httpContext.set('reqId', uuidv4());
  next();
});

app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
  if (error instanceof AppException) {
    logger.error(error.message);
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  } else {
    logger.error(error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}!`);
});
