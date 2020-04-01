// @ts-nocheck
import { GoogleSpreadsheet } from "google-spreadsheet";
import short from "short-uuid";

import { generateSeed, getAddressFromSeed } from "../actions/Wallet";
import config from "../config";
import { Campaign } from "../models/CampaignSchema";
import { Wallet } from "../models/WalletSchema";

export const getWalletsTable = async (link: string) => {
  const doc = new GoogleSpreadsheet(link);

  doc.useApiKey(config.sheetsKEY);

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  await sheet.loadHeaderRow();
  const [name, email, coin, amount] = sheet.headerValues;

  // console.log(name, email, coin, amount);

  const rows = await sheet.getRows({});
  let res: any[] = [];
  rows.forEach((x: any) => {
    res.push({
      name: x[name],
      email: x[email],
      coin: x[coin],
      amount: x[amount]
    });
  });
  return res;
};

export const addWalletsFromSheet = async (campaignId: any, wallets: any[]) => {
  try {
    // let campaign = await Campaign.findById(campaignId);
    if (wallets.length > 50) wallets = wallets.slice(0, 50);
    let res: any[] = [];
    wallets.forEach((item: any) => {
      let seed = generateSeed();
      let wallet = {
        seed,
        address: getAddressFromSeed(seed),
        link: short.generate().substring(0, 6),
        name: item.name,
        payload: null,
        password: null,
        fromName: null,
        email: item.email,
        coin: item.coin,
        amount: item.amount,
        campaign: campaignId
      };
      res.push(wallet);
    });

    await Wallet.insertMany(res);
    await Campaign.updateOne(
      { _id: campaignId },
      { $push: { wallets: res.map(x => x.link) } }
    );
    return res.length;
  } catch (error) {
    console.log(error);
  }
};
