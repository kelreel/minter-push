import "./Preset.scss";

import { Affix, Button, Card, Collapse, Drawer, Layout } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Editor from "../../components/Editor/Editor";
import Loading from "../../components/Layout/Loading";
import Balance from "../../components/Wallet/Balance/Balance";
import PasswordForm from "../../components/Wallet/PasswordForm/PasswordForm";
import GifteryLayout from "../../components/Wallet/Transfers/GifteryLayout";
import Loyality from "../../components/Wallet/Transfers/Loyality";
import Popular from "../../components/Wallet/Transfers/Popular";
import { getWallet } from "../../services/walletApi";
import { AppStoreContext } from "../../stores/appStore";
import { MultiStoreContext } from "../../stores/multiStore";
import { PresetStoreContext } from "../../stores/presetStore";

const { Content } = Layout;

const PresetView: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();
  const link = "preset_wallet";

  const [state, setState] = useState({
    password: false,
    isLoading: true,
    editor: true
  });

  useEffect(() => {
    const init = async () => {
      setState({ ...state, isLoading: true });
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
      store.setSeed(res.data.seed);
      await store.checkBalance();
      setState({ ...state, isLoading: false });
      await store.getTotalPrice();
      await mStore.initCampaign(mStore.link!, mStore.password!);
      if (mStore.preset) pStore.setPreset(mStore.preset);
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
              {!state.editor && (
                <Affix
                  style={{ position: "absolute", right: "20px", top: "80px" }}
                >
                  <Button
                    icon="edit"
                    size="large"
                    onClick={() => setState({ ...state, editor: true })}
                    z-index={4}
                  >
                    {t("editor.openEditor")}
                  </Button>
                </Affix>
              )}
              <Drawer
                title={
                  mStore.name
                    ? `${mStore.name} ${t("editor.editor")}`
                    : `${t("editor.editor")}`
                }
                placement="right"
                closable
                keyboard
                visible={state.editor}
                onClose={() => setState({ ...state, editor: false })}
                mask={false}
              >
                <Editor />
              </Drawer>
              <Card
                style={{ background: pStore.balanceBgc }}
                className="balance"
              >
                <Balance />
              </Card>
              {pStore.showTransfers && (
                <>
                  <div
                    className="title"
                    style={{ color: pStore.categoryTitleColor }}
                  >
                    {pStore.showCategoryTitle && <>{t("transfersTitle")}</>}
                  </div>

                  <div className="transfers">
                    <Popular />
                  </div>
                </>
              )}
              {pStore.showLoyalty && (
                <>
                  <div
                    className="title"
                    style={{ color: pStore.categoryTitleColor }}
                  >
                    {pStore.showCategoryTitle && <>{t("loyalityTitle")}</>}
                  </div>

                  <div className="transfers">
                    <Loyality />
                  </div>
                </>
              )}
              {pStore.showShops && (
                <>
                  <div
                    className="title"
                    style={{ color: pStore.categoryTitleColor }}
                  >
                    {pStore.showCategoryTitle && <>{t("shopListTitle")}</>}
                  </div>

                  <div className="transfers">
                    <GifteryLayout />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </Content>
  );
});

export default PresetView;
