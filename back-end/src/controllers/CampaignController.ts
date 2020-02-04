import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import express from "express";

import { Wallet, WalletStatus } from "../models/WalletSchema";
import { createWallet } from "../utils/wallet";
import { sendEmail } from "../utils/email";
import { Campaign } from "../models/CampaignSchema";
import { createCampaign, addWallets } from "../utils/campaign";

const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "30kb"
  }),
  bodyParser.json({
    limit: "10kb"
  })
);

router.get("/", async (req, res) => {
  res.send("Api works");
});

// Create new campaign
router.post("/new", async (req, res) => {
  let pass = req.body.pass;
  let name = req.body.name;

  if (pass === "") pass = null;
  if (name === "") name = null;

  try {
    let result = await createCampaign(pass, name);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// Get campaign by link
router.post("/get", async (req, res) => {
  try {
    let pass = req.body.pass;
    let link = req.body.link;
    let campaign = await Campaign.findOne({ link });

    if (!campaign) {
      res.status(404).send("Campaign not found!");
      return;
    }

    const compare = bcrypt.compareSync(pass, campaign.password);

    if (!compare) {
      res.status(401).send("Invalid password");
    } else {
      res.send(campaign);
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Set campaign properties
router.post("/set", async (req, res) => {
  try {
    let pass = req.body.pass;
    let link = req.body.link;
    let fromName = req.body.fromName;
    let payload = req.body.payload;

    let campaign = await Campaign.findOne({ link });

    if (!campaign) {
      res.status(404).send("Campaign not found!");
      return;
    }

    const compare = bcrypt.compareSync(pass, campaign.password);

    if (!compare) {
      res.status(401).send("Invalid password");
    } else {
      campaign.fromName = fromName;
      campaign.payload = payload;
      await campaign.save();
      res.send({ status: "ok" });
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add campaign wallets
router.post("/addWallets", async (req, res) => {
  try {
    let pass = req.body.pass;
    let link = req.body.link;
    let number = req.body.number;

    let campaign = await Campaign.findOne({ link });

    if (!campaign) {
      res.status(404).send("Campaign not found!");
      return;
    }

    const compare = bcrypt.compareSync(pass, campaign.password);

    if (!compare) {
      res.status(401).send("Invalid password");
    } else {
      await addWallets(campaign._id, number);
      res.send({ status: "ok" });
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default router;
