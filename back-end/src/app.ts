import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();

import ApiController from './controllers/ApiController'

app.use(helmet())
app.use(cors());
app.use(morgan("combined"));

app.use("/api", ApiController);

export default app;
