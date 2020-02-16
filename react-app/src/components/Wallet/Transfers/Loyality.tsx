import "./Transfers.scss";

import {Avatar, Card} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";

import nutLogo from "../../../assets/nut.jpg";
import popeLogo from "../../../assets/pope.jpg";
import timeLogo from "../../../assets/timeloop.png";
import {AppStoreContext} from "../../../stores/appStore";
import Phone from "../../Modals/Phone/Phone";
import Nut from "../../Modals/Nut/Nut";
import TimeLoop from "../../Modals/TimeLoop/TimeLoop";
import {TargetEnum} from "../../Multi/Main/MultiMain";
import {PresetStoreContext} from "../../../stores/presetStore";

export const targetClass = `animated infinite pulse delay-2s target`;

const Loyality: React.FC = observer(() => {
    const store = useContext(AppStoreContext);
    const pStore = useContext(PresetStoreContext);
    const {t, i18n} = useTranslation();

    const [state, setState] = useState({
        nut: false,
        phone: false,
        timeloop: false
    });

    const cardPreset = {
        background: pStore.cardsBgc,
        border: `2px solid ${pStore.cardsBorder}`
    };

    const cardTextPreset = {
        color: pStore.cardsTextColor
    };

    return (
        <>
            <Card
                style={cardPreset}
                bordered={false}
                onClick={() => {
                    setState({...state, nut: false});
                    setTimeout(() => {
                        setState({...state, nut: true});
                    }, 0);
                }}
                className={`transfer-card ${store.target === TargetEnum.nut &&
                targetClass}`}
            >
                <Avatar
                    style={{backgroundColor: "rgb(245, 106, 0)"}}
                    size={64}
                    src={nutLogo}
                />
                <h3 style={{padding: "0 5px", color: pStore.cardsTextColor}}>
                    {t("loyalityList.nut")}
                </h3>
            </Card>
            <Card
                style={cardPreset}
                bordered={false}
                onClick={() => {
                    setState({...state, phone: false});
                    setTimeout(() => {
                        setState({...state, phone: true});
                    }, 0);
                }}
                className={`transfer-card ${store.target === TargetEnum.bip2phone &&
                targetClass}`}
            >
                <Avatar style={{backgroundColor: "#de16c5"}} size={64} icon="phone"/>
                <h3 style={cardTextPreset}>{t("loyalityList.phone")}</h3>
            </Card>
            <Card
                style={cardPreset}
                bordered={false}
                onClick={() => {
                    setState({...state, timeloop: false});
                    setTimeout(() => {
                        setState({...state, timeloop: true});
                    }, 0);
                }}
                className={`transfer-card ${store.target === TargetEnum.timeloop &&
                targetClass}`}
            >
                <Avatar
                    style={{backgroundColor: "#0dc367"}}
                    size={64}
                    src={timeLogo}
                />
                <h3 style={cardTextPreset}>{t("loyalityList.timeloop")}</h3>
            </Card>
            <Card style={cardPreset} bordered={false} className="transfer-card disabled">
                <Avatar size={64} icon={"clock-circle"} src={popeLogo}/>
                <h3 style={cardTextPreset}>{t("comingSoon")}</h3>
            </Card>
            <Phone visible={state.phone}/>
            <Nut visible={state.nut}/>
            <TimeLoop visible={state.timeloop}/>
        </>
    );
});

export default Loyality;
