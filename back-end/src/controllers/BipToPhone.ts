import bodyParser from "body-parser";
import express from "express";

import {
  getBiptoPhoneInfo,
  getKeywordByPhone,
  getStatusPhone
} from "../utils/bipToPhone";

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

router.get("/getInfo", async (req, res) => {
  try {
    let result = await getBiptoPhoneInfo();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error while getting BipToPhone information");
  }
});

router.post("/getKeyword", async (req, res) => {
  try {
    let result = await getKeywordByPhone(req.body.phone);
    res.send({ keyword: result });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting BipToPhone information");
  }
});

router.post("/getStatus", async (req, res) => {
  try {
    let result = await getStatusPhone(req.body.phone);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting BipToPhone status");
  }
});

export default router;
