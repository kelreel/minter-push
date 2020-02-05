import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { MultiStoreContext } from "../../../stores/multiStore";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { message, Button } from "antd";
import { shortAddress } from "../../../services/utils";
import { PresetStoreContext } from "../../../stores/presetStore";
var QRCodeCanvas = require("qrcode.react");

const MultiWallet: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const copyAddress = () => {
    copy(mStore.address!);
    message.success(t("walletCreated.copyAddressSuccess"));
  };

  return (
    <div
      className="wallet"
      style={{
        display: "flex",
        flexFlow: "column wrap",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <h3>Wallet</h3>
      <p>Кошелек для списания монет при активации ссылок</p>
      <p className="address" onClick={copyAddress} style={{ alignSelf: "center" }}>
        {shortAddress(mStore.address!)}
      </p>
      <QRCodeCanvas
        style={{ alignSelf: "center" }}
        onClick={copyAddress}
        value={mStore.address}
        size={120}
      />
      <strong style={{ alignSelf: "center", marginTop: '15px' }}>
        Оптимальный баланс: {Math.round(mStore.wallets.length * mStore.value! * 100) / 100}{" "}
        {mStore.coin}
      </strong>
      <div className="actions">
        <Button>Copy Seed</Button>
        <Button>Explorer</Button>
      </div>
    </div>
  );
});

export default MultiWallet;
