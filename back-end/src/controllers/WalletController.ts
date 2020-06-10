import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import express from "express";
import storage from "node-persist";
import short from "short-uuid";

import { Wallet, WalletStatus } from "../models/WalletSchema";
import { getWalletFromCampaign } from "../actions/Campaign";
import { sendEmail } from "../utils/email";
import { createWallet } from "../actions/Wallet";
import { HttpException } from "../utils/errorHandler";

const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "30kb",
  }),
  bodyParser.json({
    limit: "10kb",
  })
);

router.get("/", async (req, res) => {
  res.send("Api works");
});

router.get("/count", async (req, res) => {
  let r = await Wallet.estimatedDocumentCount();
  res.send({ count: r });
});

router.get("/rates", async (req, res) => {
  let result = {
    priceMBank: await storage.getItem("priceMBank"),
    price1001: await storage.getItem("price1001"),
    currencyRates: await storage.getItem("rates"),
  };
  res.send(result);
});

router.get("/status/:link", async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ link: req.params.link });

    if (!wallet) {
      res.status(404).send("Wallet not found!");
      return;
    }

    res.send({
      address: wallet.address,
      browser: wallet.browser || null,
      status: wallet.status,
    });
  } catch (error) {}
});

// Create new wallet
router.post("/new", async (req, res) => {
  const { name, pass, payload, fromName, preset, seed } = req.body;

  try {
    let result = await createWallet(pass, name, payload, fromName, preset, seed);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get wallet by link
router.get("/wallet/:link", async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ link: req.params.link });

    if (!wallet) {
      throw new HttpException(404, "Wallet not found");
    }

    if (wallet.campaign) {
      try {
        let w = await getWalletFromCampaign(wallet);
        res.send(w);
      } catch (error) {
        throw new HttpException(400, error.toString());
      }
      return;
    }

    if (wallet.password !== null) {
      res.send({
        address: wallet.address,
        name: wallet.name,
        fromName: wallet.fromName,
        payload: wallet.payload,
        password: true,
        target: null,
        preset: wallet.preset,
      });
    } else {
      res.send({
        address: wallet.address,
        name: wallet.name,
        fromName: wallet.fromName,
        payload: wallet.payload,
        password: false,
        seed: wallet.seed,
        target: null,
        preset: wallet.preset,
      });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(400, error);
  }
});

// Get seed by password
router.post("/getSeed", async (req, res) => {
  const { link, pass } = req.body;

  try {
    if (link == null || pass == null) {
      throw new HttpException(400, "Link and password not provided");
    }

    let wallet = await Wallet.findOne({ link });

    if (!wallet) throw new HttpException(404, "Wallet not found");

    const compare = bcrypt.compareSync(pass, wallet.password);

    if (!compare) {
      throw new HttpException(401, "Invalid password");
    } else {
      res.send({ seed: wallet.seed });
      wallet.status = WalletStatus.opened;
      wallet.save();
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/touched", async (req, res) => {
  const { link } = req.body;

  try {
    let wallet = await Wallet.findOne({ link });
    wallet.status = WalletStatus.touched;
    await wallet.save();
    res.send({ status: "ok" });
  } catch (error) {
    throw new HttpException(400, error);
  }
});

router.post("/detect", async (req, res) => {
  const { link, browser } = req.body;
  let wallet;
  try {
    wallet = await Wallet.findOne({ link });
    wallet.browser = JSON.parse(browser);
    if (wallet.status === WalletStatus.created) {
      wallet.status = WalletStatus.opened;
    }
    res.send({ status: "ok" });
  } catch (error) {
    throw new HttpException(400, error);
  } finally {
    wallet.save();
  }
});

// Repack wallet
router.post("/repack", async (req, res) => {
  const { name, seed } = req.body;

  try {
    let wallet = await Wallet.findOne({ seed });
    wallet.link = short.generate().substring(0, 6);
    wallet.name = name;
    wallet.password = null;
    wallet.payload = null;
    wallet.fromName = null;
    await wallet.save();

    res.send({ link: wallet.link });
  } catch (error) {
    throw new HttpException(400, error);
  }
});

// Send e-mail
router.post("/email", async (req, res) => {
  const { link, pass, name, email, fromName } = req.body;

  try {
    let result = await sendEmail(email, link, name, fromName, pass);
    res.send(result);
  } catch (error) {
    throw new HttpException(400, error);
  }
});

export default router;
