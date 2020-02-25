import "./HomeView.scss";

import { Card, Layout, Modal, Button } from "antd";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SendForm from "../../components/SendForm/SendForm";
import WalletCreated from "../../components/WalletCreated/WalletCreated";
import { getWalletCount } from "../../services/walletApi";
import { addToHistory, historyEntryType } from "../../services/walletsHistory";
import { AppStoreContext } from "../../stores/appStore";
import history from "../../stores/history";

import Particles from "react-particles-js";

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

  const [state, setState] = useState({
    created: false,
    address: "",
    seed: "",
    link: "",
    password: "",
    countLoading: true,
    count: 0
  });

  // Get wallets count
  // useEffect(() => {
  //   const r = async () => {
  //     try {
  //       let res = await getWalletCount();
  //       setState({ ...state, count: res.data.count, countLoading: false });
  //     } catch (error) {
  //       setState({ ...state, countLoading: false });
  //     }
  //   };
  //   if (state.count === 0) {
  //     r();
  //   }
  // }, [state]);

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
    addToHistory(historyEntryType.push, address, link, seed, password);
    showAboutModal();
  };

  return (
    <Content className="home-view">
      <Particles
        className="particles"
        params={{
          particles: {
            number: {
              value: 7
            },
            size: {
              value: 3
            },
            color: {
              value: "#de3838"
            },
            line_linked: {
              enable: false
            }
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              }
            }
          }
        }}
      />
      {!state.created && (
        <>
          <Title level={3} style={{ marginBottom: "20px" }}>
            {t("home.title")}
          </Title>
          {/* {!state.countLoading && state.count !== 0 && <h4>{state.count}</h4>} */}
          <Card>
            <SendForm created={created} />
          </Card>
          <Button className="multi-btn" onClick={() => history.push("/multi")}>
            {t('multibtn')}
          </Button>
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
