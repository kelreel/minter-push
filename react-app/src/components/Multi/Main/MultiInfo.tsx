import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { MultiStoreContext } from "../../../stores/multiStore";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { message, Statistic, Row, Col } from "antd";
import { shortAddress } from "../../../services/utils";
var QRCodeCanvas = require("qrcode.react");

const MultiInfo: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const copyLink = () => {
    copy(mStore.address!);
    message.success(t("walletCreated.copyLinkSuccess"));
  };

  console.log(mStore.created);

  return (
    <div className="multy-info">
      <h3>{mStore.name}</h3>
      <p>Created: {new Date(mStore.created!).toLocaleString()}</p>
      <Row type="flex" justify="space-between">
        <Col span={4}>
          <Statistic title="Wallets" value={mStore.walletsData.length} />
        </Col>
        <Col span={4}>
          <Statistic
            title="Opened"
            suffix={`/ ${mStore.walletsData.length}`}
            value={
              mStore.walletsData.filter(
                x => x.status === "opened" || x.status === "touched"
              ).length
            }
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Touched"
            suffix={`/ ${mStore.walletsData.length}`}
            value={
              mStore.walletsData.filter(x => x.status === "touched").length
            }
          />
        </Col>
      </Row>
    </div>
  );
});

export default MultiInfo;
