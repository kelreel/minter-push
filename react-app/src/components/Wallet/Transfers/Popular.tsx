import "./Transfers.scss";

import { Avatar, Card } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppStoreContext } from "../../../stores/appStore";
import AnotherPerson from "../../Modals/AnotherPerson/AnotherPerson";
import AnotherWallet from "../../Modals/AnotherWallet/AnotherWallet";
import Bitcoin from "../../Modals/Bitcoin/Bitcoin";
import CreditCard from "../../Modals/CreditCard/CreditCard";
import { PresetStoreContext } from "../../../stores/presetStore";
import {TargetEnum} from "../../Multi/Main/MultiMain";
import {targetClass} from "./Loyality";
import Phone from "../../Modals/Phone/Phone";
import timeLogo from "../../../assets/timeloop.png";
import TimeLoop from "../../Modals/TimeLoop/TimeLoop";

const Popular: React.FC = observer(() => {
  const [state, setState] = useState({
    anotherPerson: false,
    anotherWallet: false,
    phone: false,
    timeloop: false
  });
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);
  const { t, i18n } = useTranslation();

    const cardPreset = {
        background: pStore.cardsBgc,
        border: `2px solid ${pStore.cardsBorder}`
    };

  const cardTextPreset = {
    color: pStore.cardsTextColor
  };

  return (
    <>
      {/* CARDS */}

      <Card
        style={cardPreset}
        bordered={false}
        onClick={() => {
          setState({ ...state, anotherWallet: false });
          setTimeout(() => {
            setState({ ...state, anotherWallet: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          style={{ backgroundColor: "#682ED6" }}
          size={64}
          icon="wallet"
        />
        <h3 style={cardTextPreset}>{t("transfersList.anotherWallet")}</h3>
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
      <Card
        style={cardPreset}
        bordered={false}
        onClick={() => {
          setState({ ...state, anotherPerson: false });
          setTimeout(() => {
            setState({ ...state, anotherPerson: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          style={{ backgroundColor: "rgb(245, 106, 0)" }}
          size={64}
          icon="user"
        />
        <h3 style={cardTextPreset}>{t("transfersList.anotherPerson")}</h3>
      </Card>

      {/* MODALS */}
      <AnotherPerson visible={state.anotherPerson} />
      <AnotherWallet visible={state.anotherWallet} />
      <Phone visible={state.phone}/>
      <TimeLoop visible={state.timeloop}/>
    </>
  );
});

export default Popular;
