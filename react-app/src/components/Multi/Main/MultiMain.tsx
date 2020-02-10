import "./MultiMain.scss";

import { Alert, Button, Card, message } from "antd";
import { saveAs } from "file-saver";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { ResponsiveLine } from "@nivo/line";

import { addWallets, getWalletsTxt } from "../../../services/campaignApi";
import { MultiStoreContext } from "../../../stores/multiStore";
import MultiInfo from "./MultiInfo";
import MultiWallet from "./MultiWallet";
import ParamsForm from "./ParamsForm";
import WalletTable from "./WalletTable";

import { Parser } from "json2csv";
import config from "../../../config";
import copy from "copy-to-clipboard";

export enum TargetEnum {
  timeloop = "timeloop",
  bip2phone = "bip2phone",
  yandexEda = "yandexEda",
  nut = "nut"
}

const MultiMain: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    name: "",
    password: "",
    number: 10,
    loading: false
  });

  const addWalletsAction = async () => {
    try {
      await addWallets(mStore.link!, mStore.password!);
      await mStore.getWalletsData();
      message.success("Wallets created");
    } catch (error) {
      message.error("Error while creating wallets");
    }
  };

  const getData = () => {
    return mStore.walletsData.map((item) => {
      return {
        id: item.link,
        color: "hsl(18, 70%, 50%)",
        data: [
          {
            x: Math.random(),
            y: 1
          },
          {
            x: Math.random(),
            y: 1
          },
          {
            x: Math.random(),
            y: 1
          }
        ]
      };
    })
  }

  const getTxt = async () => {
    try {
      let res = await getWalletsTxt(mStore.link!, mStore.password!);
      saveAs(new Blob([res.data]), `${mStore.name}.txt`);
    } catch (error) {
      message.error("Error while getting txt");
    }
  };

  const copyAll= async () => {
    try {
      let res = '';
      mStore.walletsData.forEach(item => {
        res += `${config.domain}${item.link}\n`
        copy(res)
      });
      message.success("Links copied!");
    } catch (error) {
      console.log(error); 
    }
  };

  const getCSV = () => {
    const parser = new Parser();
    const csv = parser.parse(
      mStore.walletsData.map(x => {
        return {
          link: `${config.domain}${x.link}`,
          status: x.status,
          address: x.address,
          lastVisit: x.lastVisit,
          name: x.name,
          email: x.email,
          coin: x.coin,
          value: x.value
        };
      })
    );
    saveAs(new Blob([csv]), `${mStore.name}.csv`);
  };

  return (
    <div className="multi-main">
      <Alert
        closable
        style={{ margin: "10px" }}
        type="info"
        message={t("multi.alert")}
      />
      <div className="row">
        <Card style={{ flex: "1" }}>
          <MultiInfo />
        </Card>
        <Card style={{ flex: "1" }}>
          <MultiWallet />
        </Card>
        <Card style={{ flex: "1" }}>
          <ParamsForm />
        </Card>
      </div>
      <div className="actions">
        <Button type="primary" onClick={addWalletsAction}>
          Add 10 wallets
        </Button>
        <Button onClick={copyAll}>Copy all links</Button>
        <Button onClick={getTxt}>Export .txt</Button>
        <Button onClick={getCSV}>Export .csv</Button>
      </div>
      <WalletTable />
    </div>
  );
});

export default MultiMain;
