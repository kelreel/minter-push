import express from "express";
import bodyParser from "body-parser";
import { GifteryOrder } from "../models/Giftery/GifteryOrderSchema";
import { Product } from "../models/Giftery/ProductSchema";
import { getGifteryBalance, makeOrder } from "../utils/giftery";
import { sha256 } from "js-sha256";
import config from "../config";
import axios from "axios";

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

router.get("/products", async (req, res) => {
  const games = [12952, 12886, 12453]
  const internet = [
    13797,
    11501,
    11871,
    13033,
    13323,
    13324,
    13709,
    13710,
    13711,
    13712,
    12765,
    11475
  ];
  const shops = [
    11481,
    13019,
    14039,
    11619,
    11483,
    12996,
    12456,
    2140,
    11616,
    12636,
    13718,
    12539
  ];
  const food = [13900, 11610, 13984, 800];
  try {
    let result = {
      games: await Product.find({ id: { $in: games } }).sort({title: 1}),
      food: await Product.find({ id: { $in: food } }).sort({ title: 1 }),
      internet: await Product.find({ id: { $in: internet } }).sort({
        title: 1
      }),
      shops: await Product.find({ id: { $in: shops } }).sort({ title: 1 })
    };
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error while getting Giftery products list");
  }
});

router.get("/certificate/:id", async (req, res) => {
  try {
    let order;

    try {
      order = await GifteryOrder.findOne({ _id: req.params.id });
      if (!order) throw "Order not found";
    } catch (error) {
      throw "Order not found";
    }

    const cmd = "getCertificate";
    const data = `{"queue_id": ${order.id}}`;
    const sig = sha256(cmd + data + config.gifteryKey);
    let result = await axios.get(`${config.gifteryURL}`, {
      params: {
        id: config.gifteryId,
        cmd,
        data,
        in: "json",
        sig
      }
    });
    if (result.data.status !== "ok") throw result.data.error.text;
    // const cert = Buffer.from(result.data.data.certificate, 'base64').toString();
    const cert = result.data.data.certificate
    res.send(cert);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/makeOrder", async (req, res) => {
  try {
    const { link, product_id, face, email_to, seed, coin } = req.body;
    let result = await makeOrder(link, product_id, face, email_to, seed, coin);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
