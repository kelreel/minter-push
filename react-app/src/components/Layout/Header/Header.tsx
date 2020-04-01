import "./Header.scss";

import { Layout, Modal, Select } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import logo from "../../../assets/minter-logo-circle.svg";
import ru from "../../../assets/rus.webp";
import uk from "../../../assets/uk.svg";
import { AppStoreContext } from "../../../stores/appStore";
import history from "../../../stores/history";
import { PresetStoreContext } from "../../../stores/presetStore";

const Header: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);
  const { Header } = Layout;
  const { Option } = Select;
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    store.changeLocale(language);
  };

  const showConfirm = () => {
    if (
      window.location.pathname === "/" ||
      window.location.pathname.includes("create") ||
      window.location.pathname.includes("history")
    )
      Modal.confirm({
        title: t("createNewWallet"),
        onOk() {
          history.push("/");
        },
        onCancel() {}
      });
    if (window.location.pathname.includes("multi")) history.push("/");
  };

  const headerStyle = {
    background: pStore.headerBgc
  };

  const headerLabel = document.location.href.includes("multi")
    ? "Push Enterprise"
    : pStore.title;

  return (
    <Header className="header" style={headerStyle}>
      <div className="logo" onClick={showConfirm}>
        {pStore.showLogo && (
          <img
            src={pStore.logoImg!}
            onError={() => (pStore.logoImg = logo)}
            style={{ height: "30px" }}
          />
        )}
        {pStore.showTitle && pStore.greeting && store.name && store.seed ? (
          <h2 style={{ color: pStore.titleColor }}>Hi, {store.name}</h2>
        ) : (
          <>
            {pStore.showTitle && (
              <h2 style={{ color: pStore.titleColor }}>{headerLabel}</h2>
            )}
          </>
        )}
      </div>
      <div className="language" style={headerStyle}>
        <Select
          defaultValue={i18n.language.substring(0, 2)}
          style={{ width: 100, background: pStore.headerBgc }}
          onChange={(val: string) => changeLanguage(val)}
        >
          <Option value="en" className="lng">
            <img
              src={uk}
              style={{
                width: "30px",
                height: "20px",
                objectFit: "cover",
                marginRight: "10px",
                background: pStore.headerBgc
              }}
            />
            <span>EN</span>
          </Option>
          <Option className="lng" value="ru">
            <img
              src={ru}
              style={{
                width: "30px",
                height: "20px",
                objectFit: "cover",
                marginRight: "10px",
                background: pStore.headerBgc
              }}
            />
            <span>RU</span>
          </Option>
        </Select>
      </div>
    </Header>
  );
});

export default Header;
