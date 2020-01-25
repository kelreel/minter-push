import "./HomeView.scss";

import { Layout, Spin, Card } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../stores/appStore";
import Loading from "../../components/Layout/Loading";
import Title from "antd/lib/typography/Title";
import SendForm from "../../components/SendForm/SendForm";
import WalletCreated from "../../components/WalletCreated/WalletCreated";

const { Content } = Layout;

type state = {
  created: boolean;
  address: string | null;
  seed: string | null;
  link: string | null;
  password: string | null;
};

const Home: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

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
  };

  return (
    <Content className="home-view">
      {!state.created && (
        <Card>
          <Title level={4}>{t("home.title")}</Title>
          <SendForm created={created} />
        </Card>
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
