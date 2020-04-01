import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import BipToPhone from "./controllers/BipToPhone";
import CampaignController from "./controllers/CampaignController";
import UserController from "./controllers/UserController";
import GifteryController from "./controllers/GifteryController";
import WalletController from "./controllers/WalletController";
import tasks from "./tasks";
import { errorMiddleware } from "./utils/errorHandler";

tasks();

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(errorMiddleware)

app.use("/api", WalletController);
app.use("/api/campaign", CampaignController);
app.use("/api/user", UserController)
app.use("/api/phone", BipToPhone);
app.use("/api/giftery", GifteryController);

export default app;
