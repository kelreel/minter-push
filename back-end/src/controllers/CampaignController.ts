import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import express from "express";

import { Wallet, WalletStatus } from "../models/WalletSchema";
import { createWallet } from "../utils/wallet";
import { sendEmail } from "../utils/email";
import { Campaign } from "../models/CampaignSchema";
import { createCampaign, addWallets, getWallets, getWalletsLinksTxt, getStats } from "../utils/campaign";

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
  let number = req.body.number;

  if (pass === "") pass = null;
  if (name === "") name = null;
  if (number === "") number = 10;
  if (number > 50) number = 50;

  try {
    let result = await createCampaign(pass, name);
    await addWallets(result._id, number);
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
    let coin = req.body.coin;
    let value = req.body.value;
    let target = req.body.target;

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
      campaign.coin = coin;
      campaign.value = value;
      campaign.target = target;
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

// Get campaign wallets
router.post("/getWallets", async (req, res) => {
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
      let wallets = await getWallets(campaign._id)
      res.send(wallets);
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Get campaign wallets
router.post("/getWalletsTxt.txt", async (req, res) => {
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
      let wallets = await getWalletsLinksTxt(campaign._id);
      res.setHeader("Content-type", "application/octet-stream");

      res.setHeader("Content-disposition", "attachment; filename=file.txt");
      res.send(wallets)
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete wallet
router.post("/deleteWallet", async (req, res) => {
  try {
    let pass = req.body.pass;
    let link = req.body.link;
    let walletLink = req.body.walletLink;

    let campaign = await Campaign.findOne({ link });

    if (!campaign) {
      res.status(404).send("Campaign not found!");
      return;
    }

    const compare = bcrypt.compareSync(pass, campaign.password);

    if (!compare) {
      res.status(401).send("Invalid password");
    } else {
      let wallet = await Wallet.findOne({link: walletLink})  
      console.log(wallet.campaign, campaign._id);    
      if (wallet.campaign.equals(campaign._id)) {
        await Wallet.deleteOne({link: walletLink})
        res.send({status: 'ok'})
        return
      }
      res.status(400).send({ status: "false" });
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get('/stat/:link', async(req, res) => {
  const link = req.params.link;

  try {
    let r = await getStats(link)
    res.send(r)
  } catch (error) {
    res.status(400).send('Error while getting statistics')
  }
})

export default router;
