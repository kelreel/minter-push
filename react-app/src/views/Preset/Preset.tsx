import "./Preset.scss";

import {Card, Layout, Affix, Button, Drawer, Collapse} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

import Balance from "../../components/Wallet/Balance/Balance";
import PasswordForm from "../../components/Wallet/PasswordForm/PasswordForm";
import Loyality from "../../components/Wallet/Transfers/Loyality";
import Shops from "../../components/Wallet/Transfers/Shops";
import Transfers from "../../components/Wallet/Transfers/Transfers";
import {getWallet} from "../../services/walletApi";
import {AppStoreContext} from "../../stores/appStore";
import history from "../../stores/history";
import Loading from "../../components/Layout/Loading";
import Editor from "../../components/Editor/Editor";
import {PresetStoreContext} from "../../stores/presetStore";
import {MultiStoreContext} from "../../stores/multiStore";

const {Content} = Layout;

const PresetView: React.FC = observer(() => {
    const store = useContext(AppStoreContext);
    const pStore = useContext(PresetStoreContext);
    const mStore = useContext(MultiStoreContext);
    const {t, i18n} = useTranslation();
    const link = "preset_wallet";

    const {Panel} = Collapse;

    const [state, setState] = useState({
        password: false,
        isLoading: true,
        editor: true
    });

    useEffect(() => {
        const init = async () => {
            setState({...state, isLoading: true});
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
            setState({...state, isLoading: false});
            await store.getTotalPrice();
            await store.getRubCourse();
            await mStore.initCampaign(mStore.link!, mStore.password!);
            if (mStore.preset) pStore.setPreset(mStore.preset)
        };
        init();
    }, []);

    return (
        <Content className="preset-view">
            {state.isLoading ? (
                <Loading/>
            ) : (
                <>
                    {store.isPassword && <PasswordForm/>}
                    {store.seed && !store.isPassword && (
                        <>
                            {!state.editor && (
                                <Affix
                                    style={{position: "absolute", right: "20px", top: "80px"}}
                                >
                                    <Button
                                        icon="edit"
                                        size="large"
                                        onClick={() => setState({...state, editor: true})}
                                        z-index={4}
                                    >
                                        Open Editor
                                    </Button>
                                </Affix>
                            )}
                            <Drawer
                                title={mStore.name ? `${mStore.name} Editor` : `Preset Editor`}
                                placement="right"
                                closable
                                visible={state.editor}
                                onClose={() => setState({...state, editor: false})}
                                mask={false}
                            >
                                <Editor/>
                            </Drawer>
                            <Card
                                style={{background: pStore.balanceBgc}}
                                className="balance"
                            >
                                <Balance/>
                            </Card>
                            {pStore.showTransfers && (
                                <>
                                    <div
                                        className="title"
                                        style={{color: pStore.categoryTitleColor}}
                                    >
                                        {pStore.showCategoryTitle && <>{t("transfersTitle")}</>}
                                    </div>

                                    <div className="transfers">
                                        <Transfers/>
                                    </div>
                                </>
                            )}
                            {pStore.showLoyalty && (
                                <>
                                    <div
                                        className="title"
                                        style={{color: pStore.categoryTitleColor}}
                                    >
                                        {pStore.showCategoryTitle && <>{t("loyalityTitle")}</>}
                                    </div>

                                    <div className="transfers">
                                        <Loyality/>
                                    </div>
                                </>
                            )}
                            {pStore.showShops && (
                                <>
                                    <div
                                        className="title"
                                        style={{color: pStore.categoryTitleColor}}
                                    >
                                        {pStore.showCategoryTitle && <>{t("shopListTitle")}</>}
                                    </div>

                                    <div className="transfers">
                                        <Shops/>
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
