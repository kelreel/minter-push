import './Header.scss';

import { Layout, Modal, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import logo from '../../../assets/minter-logo-circle.svg';
import ru from '../../../assets/rus.webp';
import uk from '../../../assets/uk.svg';
import { AppStoreContext } from '../../../stores/appStore';

const Header: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { Header,} = Layout;
  const { Option } = Select;
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    store.changeLocale(language);
  }

  const showConfirm = () => {
    if(window.location.pathname === '/')
    Modal.confirm({
      title: t('createNewWallet'),
      onOk() {
        window.location.reload();
      },
      onCancel() { }
    });
  }

  return (
    <Header className="header">
      <div className="logo" onClick={showConfirm}>
        <img src={logo} style={{ width: "30px", height: "30px" }} />
        {store.name && store.seed ? <h2>Hi, {store.name}</h2> : <h2>Push</h2>}
      </div>
      <div className="language">
        <Select
          defaultValue={i18n.language.substring(0, 2)}
          style={{ width: 100 }}
          onChange={(val: string) => changeLanguage(val)}
        >
          <Option value="en" className="lng">
            <img
              src={uk}
              style={{
                width: "30px",
                height: "20px",
                objectFit: "cover",
                marginRight: "10px"
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
                marginRight: "10px"
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
