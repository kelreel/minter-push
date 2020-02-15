import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import express from "express";
import short from "short-uuid";

import { Wallet, WalletStatus } from "../models/WalletSchema";
import { createWallet } from "../utils/wallet";
import { getWalletFromCampaign } from "../utils/campaign";
import { sendEmail } from "../utils/email";
import multer from "multer";

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
  let r = await Wallet.estimatedDocumentCount();
  res.send({ count: r });
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

    if (wallet.campaign) {
      try {
        let w = await getWalletFromCampaign(wallet)
        res.send(w);
      } catch (error) {
        res
          .status(400)
          .send(
            "Error while activating wallet. maybe the main wallet does not have enough funds"
          );
      }
      return
    }

    if (wallet.password !== null) {
      res.send({
        address: wallet.address,
        name: wallet.name,
        fromName: wallet.fromName,
        payload: wallet.payload,
        password: true,
        target: null
      });
    } else {
      res.send({
        address: wallet.address,
        name: wallet.name,
        fromName: wallet.fromName,
        payload: wallet.payload,
        password: false,
        seed: wallet.seed,
        target: null
      });
      wallet.status = WalletStatus.opened;
      wallet.save();
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
      wallet.status = WalletStatus.opened;
      wallet.save();
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/touched", async (req, res) => {
  let link = req.body.link;

  try {
    let wallet = await Wallet.findOne({link});
    wallet.status = WalletStatus.touched;
    await wallet.save()
    res.send({ status: "ok" });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/detect", async (req, res) => {
  let link = req.body.link;
  let browser = req.body.browser;

  try {
    let wallet = await Wallet.findOne({ link });
    wallet.browser = JSON.parse(browser)
    await wallet.save();
    res.send({ status: "ok" });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// Repack wallet
router.post("/repack", async (req, res) => {
  let seed = req.body.seed;
  let name = req.body.name;

  try {
    let w = await Wallet.findOne({seed});
    w.link = short.generate().substring(0, 6);
    w.name = name;
    w.password = null;
    w.payload = null;
    w.fromName = null;
    await w.save()
    
    res.send({ link: w.link });
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
    let result = await sendEmail(email, link, name, fromName, pass);
    //res.send({ status: "ok" });
    res.send(result)
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

export const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log(__dirname + "/uploads");

    cb(null, __dirname + "/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  }
});

var upload = multer({ storage: storage, limits: {
  fileSize: 5 * 1024 * 1024
} });

router.post("/upload", upload.single('file'), (req, res) => {
  const file = req.file;
  // console.log(file.originalname);
  
  if (!file) {
    res.status(400).send('Please upload a file')
  }

  res.send(file.filename);
});

router.get("/img/:id", function(req,res) {
  res.sendFile(__dirname + `/uploads/${req.params.id}`);
})

export default router;
