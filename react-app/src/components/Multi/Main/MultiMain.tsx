import "./MultiMain.scss";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { MultiStoreContext } from "../../../stores/multiStore";
import { Card, message, Button, Input, Icon, InputNumber, Alert } from "antd";
import { shortAddress } from "../../../services/utils";
import copy from "copy-to-clipboard";
import MultiWallet from "./MultiWallet";
import ParamsForm from "./ParamsForm";
import MultiInfo from "./MultiInfo";
import WalletTable from "./WalletTable";
import { addWallets } from "../../../services/campaignApi";

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

  const alertMessage = `Списание с кошелька выполняется по факту перехода по ссылке. 
  Не забудьте пополнить баланс (и еще немного на комисии) перед тем, как поделиться ссылками.`;

  return (
    <div className="multi-main">
      {/* <Alert
        closable
        style={{ margin: "10px" }}
        type="warning"
        message={alert2}
        showIcon
      /> */}
      <Alert
        closable
        style={{ margin: "10px" }}
        type="info"
        message={alertMessage}
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
      <WalletTable />
      <div className="actions">
        <Button type="primary" onClick={addWalletsAction}>
          Add 10 wallets
        </Button>
      </div>
    </div>
  );
});

export default MultiMain;
