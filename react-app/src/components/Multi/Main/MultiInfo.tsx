import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { MultiStoreContext } from "../../../stores/multiStore";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { message, Statistic, Row, Col, Icon } from "antd";
import { shortAddress } from "../../../services/utils";
import config from "../../../config";
var QRCodeCanvas = require("qrcode.react");

const MultiInfo: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const copyLink = () => {
    copy(`${config.domain}${mStore.link}`);
    message.success(t("walletCreated.copyLinkSuccess"));
  };

  return (
    <div className="multi-info">
      <h3>{mStore.name}</h3>
      <p className="link" onClick={copyLink}>{`${config.domain}${mStore.link}`} <Icon type="copy"/></p>
      <p>{t('multi.created')} {new Date(mStore.created!).toLocaleString()}</p>
      <div className="stats">
        <Statistic
          title="Opened"
          suffix={`/ ${mStore.walletsData.length}`}
          value={
            mStore.walletsData.filter(
              x => x.status === "opened" || x.status === "touched"
            ).length
          }
        />
        <Statistic
          title="Touched"
          suffix={`/ ${mStore.walletsData.length}`}
          value={mStore.walletsData.filter(x => x.status === "touched").length}
        />
      </div>
    </div>
  );
});

export default MultiInfo;
