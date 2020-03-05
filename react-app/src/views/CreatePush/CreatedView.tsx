import "./CreatedView.scss";

import {Layout, message, Modal} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import WalletCreated from "../../components/WalletCreated/WalletCreated";
import {AppStoreContext} from "../../stores/appStore";

import Particles from "react-particles-js";
import {useParams} from "react-router-dom";
import {particlesParams} from "../../services/utils";
import {getWallet} from "../../services/walletApi";
import Loading from "../../components/Layout/Loading";

const {Content} = Layout;

const CreatedView: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const {link} = useParams();
  const {t, i18n} = useTranslation();

  const showAboutModal = () => {
    Modal.info({
      content: <>{t("walletCreated.modalAbout")}</>,
      onOk() {
      },
      maskClosable: true,
      autoFocusButton: "ok"
    });
  }

  const [state, setState] = useState({
    address: "",
    link,
    isLoading: true
  });

  useEffect(() => {
    store.setRates();
    const r = async () => {
      setState({...state, isLoading: true})
      try {
        let res = await getWallet(link!);
        setState({...state, address: res.data.address, isLoading: false})
        // showAboutModal()
        document.title = `Push (${link})`
      } catch (error) {
        setState({...state, isLoading: false})
        message.error('Error while getting Push wallet address')
      }
    }
    r()
    return function cleanTitle () { document.title = 'Push' }
  }, [])

  return (
    <Content className="home-view">
      {!state.isLoading ? <WalletCreated
        address={state.address}
        link={link!}
      /> : <Loading size="64px" />}
    </Content>
  );
});

export default CreatedView;
