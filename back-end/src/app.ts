import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import ApiController from './controllers/ApiController';
import BipToPhone from './controllers/BipToPhone';
import CampaignController from './controllers/CampaignController'

const app = express();

app.set("trust proxy", 1);

app.use(helmet())
app.use(cors());
app.use(morgan("combined"));

app.use("/api", ApiController);
app.use("/api/phone", BipToPhone);
app.use("/api/campaign", CampaignController);

export default app;
