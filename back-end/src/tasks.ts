import cron from "node-cron";
import storage from "node-persist";
import { saveGifteryProducts } from "./utils/giftery";
import { initStorage, updateStorage } from "./utils/storage";

const tasks = () => {
  initStorage();

  const getProductTask = cron.schedule("*/15 * * * *", saveGifteryProducts);
  getProductTask.start();

  const updateStorageTask = cron.schedule("*/15 * * * *", updateStorage);
  updateStorageTask.start();
};

export default tasks