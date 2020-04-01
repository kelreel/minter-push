import { Button, message } from "antd";
import copy from "copy-to-clipboard";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { shortAddress } from "../../../services/utils";
import { MultiStoreContext } from "../../../stores/multiStore";

var QRCodeCanvas = require("qrcode.react");

const MultiWallet: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const copyAddress = () => {
    copy(mStore.address!);
    message.success(t("walletCreated.copyAddressSuccess"));
  };

  const copySeed = () => {
    copy(mStore.seed!);
    message.success(t("walletCreated.copySeedSuccess"));
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
      <h3>{t("multi.wallet")}</h3>
      <p>{t("multi.walletDesc")}</p>
      <p
        className="address"
        onClick={copyAddress}
        style={{ alignSelf: "center" }}
      >
        {shortAddress(mStore.address!)}
      </p>
      <QRCodeCanvas
        style={{ alignSelf: "center" }}
        onClick={copyAddress}
        value={mStore.address}
        size={120}
      />
      <strong style={{ alignSelf: "center", marginTop: "15px" }}>
        {t("multi.balance")}: {mStore.balance} {mStore.coin}
      </strong>
      <strong style={{ alignSelf: "center", marginTop: "15px" }}>
        {t("multi.optimalBalance")}:{" "}
        {Math.round(mStore.walletsData.length * mStore.value! * 100) / 100}{" "}
        {mStore.coin}
      </strong>
      <div className="actions">
        <Button onClick={copySeed}>Copy Seed</Button>
        <a
          href={`https://minterscan.net/address/${mStore.address}`}
          target="_blank"
          className="ant-btn"
        >
          Explorer
        </a>
      </div>
    </div>
  );
});

export default MultiWallet;
