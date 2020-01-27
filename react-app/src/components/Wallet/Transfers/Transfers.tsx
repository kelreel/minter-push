import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../../stores/appStore";
import { observer } from "mobx-react-lite";
import { Card, Avatar } from "antd";
import "./Transfers.scss";
import AnotherPerson from "../../Modals/AnotherPerson/AnotherPerson";
import AnotherWallet from "../../Modals/AnotherWallet/AnotherWallet";

const Transfers: React.FC = observer(() => {
  const [state, setState] = useState({
    anotherPerson: false,
    anotherWallet: false
  });
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* CARDS */}
      <Card
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
        <h3>{t("transfersList.anotherPerson")}</h3>
      </Card>
      <Card
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
        <h3>{t("transfersList.anotherWallet")}</h3>
      </Card>
      <Card className="transfer-card">
        <Avatar
          style={{ backgroundColor: "#0dc367" }}
          size={64}
          icon="credit-card"
        />
        <h3>{t("transfersList.creditCard")}</h3>
      </Card>
      <Card className="transfer-card">
        <Avatar
          style={{ backgroundColor: "#f7931a" }}
          size={64}
          icon="money-collect"
        />
        <h3>{t("transfersList.bitcoin")}</h3>
      </Card>

      {/* MODALS */}
      <AnotherPerson visible={state.anotherPerson} />
      <AnotherWallet visible={state.anotherWallet} />
    </>
  );
});

export default Transfers;
