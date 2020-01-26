import "./WalletView.scss";

import { Card, Layout } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Balance from "../../components/Wallet/Balance/Balance";
import PasswordForm from "../../components/Wallet/PasswordForm/PasswordForm";
import { getWallet } from "../../services/walletApi";
import { AppStoreContext } from "../../stores/appStore";
import history from "../../stores/history";
import Transfers from "../../components/Wallet/Transfers/Transfers";
import Shops from "../../components/Wallet/Transfers/Shops";
import Loyality from "../../components/Wallet/Transfers/Loyality";

const { Content } = Layout;

const WalletView: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();
  const { link } = useParams();

  const [state, setState] = useState({
    password: false
  });

  useEffect(() => {
    const init = async () => {
      try {
        let res = await getWallet(link as string);
        store.setWalletWithoutSeed(
          res.data.address,
          res.data.name,
          res.data.fromName,
          res.data.payload,
          res.data.password,
          // @ts-ignore
          link
        );
        if (res.data.seed) store.setSeed(res.data.seed);
      } catch (error) {
        console.log(error);
        history.push("/");
      }

      await store.checkBalance();
      await store.getTotalPrice();
      await store.getRubCourse();
      console.log(store.rubCourse);
    };
    init();
  }, []);

  return (
    <Content className="wallet-view">
      {store.isPassword ? (
        <PasswordForm />
      ) : (
        <>
          <Card className="balance">
            <Balance />
          </Card>
          <div className="title">{t("transfersTitle")}</div>
          <div className="transfers">
            <Transfers />
          </div>
          <div className="title">{t("shopListTitle")}</div>
          <div className="transfers">
            <Shops />
          </div>
          <div className="title">{t("loyalityTitle")}</div>
          <div className="transfers">
            <Loyality />
          </div>
        </>
      )}
    </Content>
  );
});

export default WalletView;
