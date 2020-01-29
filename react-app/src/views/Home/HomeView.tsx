import "./HomeView.scss";

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

const { Content } = Layout;

const Home: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  function showAboutModal() {
    Modal.info({
      content: <>{t("walletCreated.modalAbout")}</>,
      onOk() {}
    });
  }

  console.log(config.apiURL)
  

  const [state, setState] = useState({
    created: false,
    address: "",
    seed: "",
    link: "",
    password: ""
  });

  const created = (
    address: string,
    seed: string,
    link: string,
    password: string
  ) => {
    setState({
      ...state,
      created: true,
      address,
      seed,
      link,
      password
    });
    addToHistory(address, link, seed)
    showAboutModal();
  };
  
  return (
    <Content className="home-view">
      {!state.created && (
        <>
          <Title level={3} style={{ marginBottom: "20px" }}>
            {t("home.title")}
          </Title>
          <Card>
            <SendForm created={created} />
          </Card>
        </>
      )}
      {state.created && (
        <WalletCreated
          address={state.address}
          seed={state.seed}
          link={state.link}
          password={state.password}
        />
      )}
    </Content>
  );
});

export default Home;
