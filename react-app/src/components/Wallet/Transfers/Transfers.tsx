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

const Transfers: React.FC = observer(() => {
  const [state, setState] = useState({
    anotherPerson: false,
    anotherWallet: false,
    creditCard: false,
    bitcoin: false
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
          setState({ ...state, creditCard: false });
          setTimeout(() => {
            setState({ ...state, creditCard: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          style={{ backgroundColor: "#0dc367" }}
          size={64}
          icon="credit-card"
        />
        <h3 style={cardTextPreset}>{t("transfersList.creditCard")}</h3>
      </Card>
      <Card
        style={cardPreset}
        onClick={() => {
          setState({ ...state, bitcoin: false });
          setTimeout(() => {
            setState({ ...state, bitcoin: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          style={{ backgroundColor: "#f7931a" }}
          size={64}
          icon="money-collect"
        />
        <h3 style={cardTextPreset}>{t("transfersList.bitcoin")}</h3>
      </Card>

      {/* MODALS */}
      <AnotherPerson visible={state.anotherPerson} />
      <AnotherWallet visible={state.anotherWallet} />
      <CreditCard visible={state.creditCard} />
      <Bitcoin visible={state.bitcoin} />
    </>
  );
});

export default Transfers;
