import "./MultiMain.scss";

import { Alert, Button, Card, message, Modal, Input } from "antd";
import { saveAs } from "file-saver";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  addWallets,
  getWalletsTxt,
  sheetAdd
} from "../../../services/campaignApi";
import { MultiStoreContext } from "../../../stores/multiStore";
import MultiInfo from "./MultiInfo";
import MultiWallet from "./MultiWallet";
import ParamsForm from "./ParamsForm";
import WalletTable from "./WalletTable";

import { Parser } from "json2csv";
import config from "../../../config";
import copy from "copy-to-clipboard";
import PresetSettings from "./PresetSettings";

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
    loading: false,
    sheetsModal: false,
    sheetsLink: "",
    sheetsPreview: null,
    sheetsLoading: false
  });

  const importSheet = async () => {
    try {
      setState({ ...state, sheetsLoading: true });
      let r = await sheetAdd(mStore.link!, mStore.password!, state.sheetsLink);
      message.success(`Imported wallets: ${r.data.count}`);
      setState({ ...state, sheetsLoading: false, sheetsModal: false, sheetsLink: '' });
      mStore.getWalletsData()
    } catch (error) {
      message.error(error.message);
      setState({ ...state, sheetsLoading: false });
    }
  };

  const addWalletsAction = async () => {
    try {
      await addWallets(mStore.link!, mStore.password!);
      await mStore.getWalletsData();
      message.success("Wallets created");
      mStore.getWalletsData()
    } catch (error) {
      message.error("Error while creating wallets");
    }
  };

  const getTxt = async () => {
    try {
      let res = await getWalletsTxt(mStore.link!, mStore.password!);
      saveAs(new Blob([res.data]), `${mStore.name}.txt`);
    } catch (error) {
      message.error("Error while getting txt");
    }
  };

  const copyAll = async () => {
    try {
      let res = "";
      mStore.walletsData.forEach(item => {
        res += `${config.domain}${item.link}\n`;
        copy(res);
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
        <div className="main" style={{ display: 'flex', flexFlow: 'column wrap', flex: "1" }}>
          <Card style={{flex: 1}}>
            <MultiInfo />
          </Card>
          <Card>
            <PresetSettings />
          </Card>
        </div>
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
        <Button
          icon="table"
          onClick={() => setState({ ...state, sheetsModal: true })}
        >
          Import from Google
        </Button>
        <Button onClick={copyAll}>Copy all links</Button>
        <Button onClick={getTxt}>Export .txt</Button>
        <Button onClick={getCSV}>Export .csv</Button>
      </div>
      <WalletTable />

      <Modal
        wrapClassName="sheets-modal"
        visible={state.sheetsModal}
        maskClosable
        title="Google Sheets"
        onCancel={() =>
          setState({ ...state, sheetsModal: false, sheetsPreview: null })
        }
        footer={
          <>
            <Button
              key="back"
              onClick={() =>
                setState({ ...state, sheetsModal: false, sheetsPreview: null })
              }
            >
              Закрыть
            </Button>
            <Button
              type="primary"
              onClick={importSheet}
              loading={state.sheetsLoading}
              disabled={!state.sheetsLink.includes("spreadsheets")}
            >
              Ипортировать
            </Button>
          </>
        }
      >
        <div className="sheets">
          <div className="description">
            <p>Порядок столбцов:</p>
            <strong>Имя, Емейл, Монета, Количество</strong>
            <p>Пустые значения будут заменены автоматически</p>
            <p>Не забудьте включить доступ по ссылке.</p>
            <a
              href="https://docs.google.com/spreadsheets/d/1OMwpnFsPqinZlOtGOCGLDAo0DgiDrwKH4SJ9uU07dd8/edit#gid=2069378840"
              target="_blank"
            >
              Пример таблицы
            </a>
          </div>
          <div className="field">
            <label>Ссылка на таблицу:</label>{" "}
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/1OMwpnFsPqinZlOtGOCGLDAo0DgiDrwKH4SJ9uU07dd8/edit?usp=sharing"
              value={state.sheetsLink}
              onChange={e => setState({ ...state, sheetsLink: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default MultiMain;
