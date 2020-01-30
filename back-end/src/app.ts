import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();

app.set("trust proxy", 1);

import ApiController from './controllers/ApiController'
import BipToPhone from './controllers/BipToPhone'

app.use(helmet())
app.use(cors());
app.use(morgan("combined"));

app.use("/api", ApiController);
app.use("/api/phone", BipToPhone);

export default app;
