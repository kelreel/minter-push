import "./Transfers.scss";

import { Avatar, Card } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import dsLogo from "../../../assets/ds.png";
import ozonLogo from "../../../assets/ozon.png";
import perekrestokLogo from "../../../assets/perekrestok.png";
import yandexLogo from "../../../assets/yandex.png";
import { AppStoreContext } from "../../../stores/appStore";
import Ozon from "../../Modals/Ozon/Ozon";
import YandexEda from "../../Modals/YandexEda/YandexEda";
import Perekrestok from "../../Modals/Perekrestok/Perekrestok";
import DS from "../../Modals/DS/DS";
import { TargetEnum } from "../../Multi/Main/MultiMain";
import { targetClass } from "./Loyality";

const Shops: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    ozon: false,
    yandex: false,
    perekrestok: false,
    ds: false
  });

  return (
    <>
      <Card
        onClick={() => {
          setState({ ...state, ozon: false });
          setTimeout(() => {
            setState({ ...state, ozon: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          className="ozon-logo"
          style={{ backgroundColor: "rgb(182, 255, 169)" }}
          size={64}
          src={ozonLogo}
        />
        <h3>{t("shopList.ozon")}</h3>
      </Card>
      <Card
        onClick={() => {
          setState({ ...state, yandex: false });
          setTimeout(() => {
            setState({ ...state, yandex: true });
          }, 0);
        }}
        className={`transfer-card ${store.target === TargetEnum.yandexEda &&
          targetClass}`}
      >
        <Avatar
          style={{ backgroundColor: "#682ED6" }}
          size={64}
          src={yandexLogo}
        />
        <h3>{t("shopList.yandex")}</h3>
      </Card>
      <Card
        onClick={() => {
          setState({ ...state, perekrestok: false });
          setTimeout(() => {
            setState({ ...state, perekrestok: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar
          style={{ backgroundColor: "#0dc367" }}
          size={64}
          src={perekrestokLogo}
        />
        <h3>{t("shopList.perekrestok")}</h3>
      </Card>
      <Card
        onClick={() => {
          setState({ ...state, ds: false });
          setTimeout(() => {
            setState({ ...state, ds: true });
          }, 0);
        }}
        className="transfer-card"
      >
        <Avatar style={{ backgroundColor: "#f7931a" }} size={64} src={dsLogo} />
        <h3>{t("shopList.ds")}</h3>
      </Card>
      <Ozon visible={state.ozon} />
      <YandexEda visible={state.yandex} />
      <Perekrestok visible={state.perekrestok} />
      <DS visible={state.ds} />
    </>
  );
});

export default Shops;
