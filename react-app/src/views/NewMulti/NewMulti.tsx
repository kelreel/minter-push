import "./NewMulti.scss";

import { Card, Layout, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SendForm from "../../components/SendForm/SendForm";
import WalletCreated from "../../components/WalletCreated/WalletCreated";
import { AppStoreContext } from "../../stores/appStore";
import { getWalletsHistory, addToHistory } from "../../services/walletsHistory";
import { getInfo } from "../../services/bipToPhoneApi";
import config from "../../config";
import { estimateCommission } from "../../services/tx";
import { getWalletCount } from "../../services/walletApi";
import NewMultiForm from "../../components/Multi/NewCampaign/NewCampaign";
import { MultiStoreContext } from "../../stores/multiStore";

const { Content } = Layout;

const NewMultiView: React.FC = observer(() => {
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    created: false,
    name: "",
    password: "",
    number: 10
  });

  return (
    <Content className="new-multi-view">
        <>
          <Title level={3} style={{ marginBottom: "20px" }}>
            {/* {t("home.title")} */}
            Мультипуш за несколько кликов!
          </Title>
          <Card>
            <NewMultiForm />
          </Card>
        </>
    </Content>
);
})

export default NewMultiView;
