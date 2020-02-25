import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import storage from "node-persist";

import WalletController from "./controllers/WalletController";
import BipToPhone from "./controllers/BipToPhone";
import CampaignController from "./controllers/CampaignController";
import { saveGifteryProducts } from "./utils/giftery";
import { initStorage, updateStorage } from "./utils/storage";

const app = express();

initStorage();

app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

app.use("/api", WalletController);
app.use("/api/phone", BipToPhone);
app.use("/api/campaign", CampaignController);

const getProductTask = cron.schedule("15 * * * *", saveGifteryProducts);
getProductTask.start();

const updateStorageTask = cron.schedule("15 * * * *", updateStorage);
updateStorageTask.start();

export default app;
