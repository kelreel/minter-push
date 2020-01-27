import "./Transfers.scss";

import { Avatar, Card } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import nutLogo from "../../../assets/nut.jpg";
import popeLogo from "../../../assets/pope.jpg";
import { AppStoreContext } from "../../../stores/appStore";

const Loyality: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    nut: false,
    phone: false,
    hotels: false
  });

  return (
    <>
      <Card
        onClick={() => {
          setState({ ...state, nut: false });
          setTimeout(() => {
            setState({ ...state, nut: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          style={{ backgroundColor: "rgb(245, 106, 0)" }}
          size={64}
          src={nutLogo}
        />
        <h3>{t("loyalityList.nut")}</h3>
      </Card>
      <Card
        onClick={() => {
          setState({ ...state, nut: false });
          setTimeout(() => {
            setState({ ...state, nut: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar style={{ backgroundColor: "#de16c5" }} size={64} icon="phone" />
        <h3>{t("loyalityList.phone")}</h3>
      </Card>
      <Card
        onClick={() => {
          setState({ ...state, nut: false });
          setTimeout(() => {
            setState({ ...state, nut: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar style={{ backgroundColor: "#0dc367" }} size={64} icon="tag" />
        <h3>{t("loyalityList.hotel")}</h3>
      </Card>
      <Card className="transfer-card disabled">
        <Avatar size={64} icon={"clock-circle"} src={popeLogo} />
        <h3>{t("comingSoon")}</h3>
      </Card>
    </>
  );
});

export default Loyality;
