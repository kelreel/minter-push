import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import express from 'express';

import { Wallet, WalletStatus } from '../models/WalletSchema';
import { createWallet } from '../utils/wallet';
import { sendEmail } from '../utils/email';

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

router.get("/count", async (req, res) => {
  let r = await Wallet.estimatedDocumentCount()
  res.send({count: r})
});

// Create new wallet
router.post("/new", async (req, res) => {
  let pass = req.body.pass;
  let name = req.body.name;
  let payload = req.body.payload;
  let fromName = req.body.fromName;

  if (pass === "") pass = null;
  if (name === "") name = null;
  if (fromName === "") fromName = null;
  if (payload === "") payload = null;

  try {
    let result = await createWallet(pass, name, payload, fromName);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// Get wallet by link
router.get("/wallet/:id", async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ link: req.params.id });

    if (!wallet) {
      res.status(404).send("Wallet not found!");
      return;
    }

    wallet.status = WalletStatus.opened;
    wallet.save;

    if (wallet.password !== null) {
      res.send({
        address: wallet.address,
        name: wallet.name,
        fromName: wallet.fromName,
        payload: wallet.payload,
        password: true
      });
    } else {
      res.send({
        address: wallet.address,
        name: wallet.name,
        fromName: wallet.fromName,
        payload: wallet.payload,
        password: false,
        seed: wallet.seed
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Get seed by password
router.post("/getSeed", async (req, res) => {
  let pass = req.body?.pass;
  let link = req.body?.link;

  try {
    if (link == null || pass == null) {
      res.status(400).send("Link and password not provided");
      return;
    }

    let wallet = await Wallet.findOne({ link });

    if (!wallet) res.status(404).send("Wallet not found");

    const compare = bcrypt.compareSync(pass, wallet.password);

    if (!compare) {
      res.status(401).send("Invalid password");
    } else {
      res.send({ seed: wallet.seed });
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// Send e-mail
router.post("/email", async (req, res) => {
  let pass = req.body.pass;
  let email = req.body.email;
  let name = req.body.name;
  let link = req.body.link;
  let fromName = req.body.fromName;

  try {
    let result = await sendEmail(email, link, name, fromName, pass)
    res.send({status: 'ok'});
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

export default router;
