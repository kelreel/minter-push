import "./WalletView.scss";

import {Card, Layout} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

import Balance from "../../components/Wallet/Balance/Balance";
import PasswordForm from "../../components/Wallet/PasswordForm/PasswordForm";
import Loyality from "../../components/Wallet/Transfers/Loyality";
import GifteryLayout from "../../components/Wallet/Transfers/GifteryLayout";
import Popular from "../../components/Wallet/Transfers/Popular";
import {getWallet, sendBrowserInfo} from "../../services/walletApi";
import {AppStoreContext} from "../../stores/appStore";
import history from "../../stores/history";
import Loading from "../../components/Layout/Loading";
import {PresetStoreContext} from "../../stores/presetStore";

const {Content} = Layout;

const WalletView: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);
  const {t, i18n} = useTranslation();
  const {link} = useParams();

  const [state, setState] = useState({
    password: false,
    isLoading: true
  });

  useEffect(() => {
    const init = async () => {
      setState({...state, isLoading: true});
      try {
        let res = await getWallet(link as string);
        store.setWalletWithoutSeed(
          res.data.address,
          res.data.name,
          res.data.fromName,
          res.data.payload,
          res.data.password,
          // @ts-ignore
          link,
          res.data.target
        );
        if (res.data.seed) store.setSeed(res.data.seed);
        if (res.data.status) store.setStatus(res.data.status);
        if (res.data.preset) pStore.setPreset(res.data.preset);
        await store.checkBalance();
        setState({...state, isLoading: false});
        await store.getTotalPrice();
        sendBrowserInfo(store.link!);
        console.log(store.rubCourse);
      } catch (error) {
        console.log(error);
        history.push("/");
        setState({...state, isLoading: false});
      }
    };
    init();
  }, []);

  return (
    <Content className="wallet-view">
      {state.isLoading ? (
        <Loading/>
      ) : (
        <>
          {store.isPassword && <PasswordForm/>}
          {store.seed && !store.isPassword && (
            <>

              <Card style={{background: pStore.balanceBgc}} className="balance">
                <Balance/>
              </Card>

              {/*{pStore.showLoyalty && (<>*/}
              {/*  <div*/}
              {/*    className="title"*/}
              {/*    style={{color: pStore.categoryTitleColor, marginBottom: '30px', marginTop: '30px'}}*/}
              {/*  >*/}
              {/*    {pStore.showCategoryTitle && <>{t("loyalityTitle")}</>}*/}
              {/*  </div>*/}
              {/*  <div className="transfers">*/}
              {/*    <Loyality/>*/}
              {/*  </div>*/}
              {/*</>)}*/}

              {pStore.showTransfers && (
                <>
                  <div
                    className="title"
                    style={{color: pStore.categoryTitleColor, marginBottom: '30px', marginTop: '30px'}}
                  >
                    {pStore.showCategoryTitle && <>{t("transfersTitle")}</>}
                  </div>
                  <div className="transfers">
                    <Popular/>
                  </div>
                </>)}

              {pStore.showShops && <>
                  <GifteryLayout/>
              </>}
            </>
          )}
        </>
      )}
    </Content>
  );
});

export default WalletView;
