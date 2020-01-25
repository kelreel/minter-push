import { Layout, Menu, Select } from 'antd';
import React, { useContext } from 'react';
import logo from '../../../assets/minter-logo-circle.svg';
import './Header.scss';
import { useTranslation } from 'react-i18next';

import uk from '../../../assets/uk.svg'
import ru from '../../../assets/rus.webp'
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../../../stores/appStore';

const Header: React.FC = observer(() => {
  const store = useContext(AppStoreContext)
  const { SubMenu } = Menu;
  const { Header, Content, Sider } = Layout;
  const { Option } = Select;
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => i18n.changeLanguage(language);

  return (
    <Header className="header">
      <div className="logo">
        <img src={logo} style={{ width: "30px", height: "30px" }} />
        {store.name && store.seed ? <h2>Hi, {store.name}!</h2> : <h2>Push</h2>}
      </div>
      <div className="language">
        <Select
          defaultValue={i18n.language}
          style={{ width: 100 }}
          onChange={(val: string) => changeLanguage(val)}
        >
          <Option value="en" className="lng">
            <img
              src={uk}
              style={{ width: "30px", height: "20px", objectFit: "cover", marginRight: '10px' }}
            />
            <span>EN</span>
          </Option>
          <Option className="lng" value="ru">
            <img
              src={ru}
              style={{ width: "30px", height: "20px", objectFit: "cover", marginRight: '10px' }}
            />
            <span>RU</span>
          </Option>
        </Select>
      </div>
      {/* <Menu
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">Спец. предложение</Menu.Item>
        </Menu> */}
    </Header>
  );
});

export default Header;
