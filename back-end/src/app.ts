import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import ApiController from './controllers/ApiController';
import BipToPhone from './controllers/BipToPhone';
import CampaignController from './controllers/CampaignController'

const app = express();

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();

  app.options("*", (req, res) => {
    // allowed XHR methods
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    res.send();
  });
});

app.use(cors())

app.use(helmet())
app.use(morgan("combined"));

app.use("/api", ApiController);
app.use("/api/phone", BipToPhone);
app.use("/api/campaign", CampaignController);

export default app;
