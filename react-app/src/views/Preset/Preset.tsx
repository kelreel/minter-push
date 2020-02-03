import "./Preset.scss";

import { Card, Layout, Affix, Button, Drawer, Collapse } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Balance from "../../components/Wallet/Balance/Balance";
import PasswordForm from "../../components/Wallet/PasswordForm/PasswordForm";
import Loyality from "../../components/Wallet/Transfers/Loyality";
import Shops from "../../components/Wallet/Transfers/Shops";
import Transfers from "../../components/Wallet/Transfers/Transfers";
import { getWallet } from "../../services/walletApi";
import { AppStoreContext } from "../../stores/appStore";
import history from "../../stores/history";
import Loading from "../../components/Layout/Loading";
import Editor from "../../components/Editor/Editor";

const { Content } = Layout;

const PresetView: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();
  const { link } = useParams();

  const { Panel } = Collapse;

  const [state, setState] = useState({
    password: false,
    isLoading: true
  });

  useEffect(() => {
    const init = async () => {
      setState({ ...state, isLoading: true });
      await store.checkBalance();
      setState({ ...state, isLoading: false });
      await store.getTotalPrice();
      await store.getRubCourse();
      console.log(store.rubCourse);
    };
    init();
  }, []);

  return (
    <Content className="preset-view">
      {state.isLoading ? (
        <Loading />
      ) : (
        <>
          {store.isPassword && <PasswordForm />}
          {store.seed && !store.isPassword && (
            <>
              <Drawer
                title="Push Editor"
                placement="right"
                closable={false}
                visible={true}
                mask={false}
              >
                <Editor />
              </Drawer>
              <Card className="balance">
                <Balance />
              </Card>
              <div className="title">{t("transfersTitle")}</div>
              <div className="transfers">
                <Transfers />
              </div>
              <div className="title">{t("loyalityTitle")}</div>
              <div className="transfers">
                <Loyality />
              </div>
              <div className="title">{t("shopListTitle")}</div>
              <div className="transfers">
                <Shops />
              </div>
            </>
          )}
        </>
      )}
    </Content>
  );
});

export default PresetView;
