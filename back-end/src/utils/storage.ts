import axios from "axios";
import storage from "node-persist";

const get1001 = async (): Promise<number> => {
  try {
    let res = await axios.get("https://minter.1001btc.com/en/getcfg/");
    return res.data.bip2usdt;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const getMBankPrice = async () => {
  try {
    let res = await axios.get("https://api.bip.dev/api/price");
    return res.data.data.price / 10000;
  } catch (error) {
    return null;
  }
};

const getCurrencyRates = async () => {
  try {
    let res = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=USD`
    );
    return res.data.rates;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateStorage = async () => {
  await storage.setItem("price1001", await get1001());
  await storage.setItem("priceMBank", await getMBankPrice());
  await storage.setItem("rates", await getCurrencyRates());
  console.log(`${new Date()} Storage updated`);
};

export const initStorage = async () => {
  await storage.init();
  await storage.clear();
  await updateStorage();
};
