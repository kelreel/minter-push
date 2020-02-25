import axios from "axios";
import config from "../config";
import { sha256 } from "js-sha256";
import { Product } from "../models/Giftery/ProductSchema";

export const saveGifteryProducts = async () => {
  const cmd = "getProducts";
  const data = "";
  try {
    const sig = sha256(cmd + data + config.gifteryKey);
    let res = await axios.get(`${config.gifteryURL}`, {
      params: {
        id: config.gifteryId,
        cmd,
        data,
        sig
      }
    });

    console.log(`Get Products Count: ${res.data.data.length}`);

    await Product.remove({})
    await Product.insertMany(res.data.data)

  } catch (error) {
    console.log(error);
  }
};
