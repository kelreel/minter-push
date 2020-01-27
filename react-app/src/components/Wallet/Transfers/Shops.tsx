import './Transfers.scss';

import { Avatar, Card } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import dsLogo from '../../../assets/ds.png';
import ozonLogo from '../../../assets/ozon.png';
import perekrestokLogo from '../../../assets/perekrestok.png';
import yandexLogo from '../../../assets/yandex.png';
import { AppStoreContext } from '../../../stores/appStore';

const Shops: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  return (
    <>
      <Card className="transfer-card">
        <Avatar
          style={{ backgroundColor: "rgb(245, 106, 0)" }}
          size={64}
          src={ozonLogo}
        />
        <h3>{t("shopList.ozon")}</h3>
      </Card>
      <Card className="transfer-card">
        <Avatar
          style={{ backgroundColor: "#682ED6" }}
          size={64}
          src={yandexLogo}
        />
        <h3>{t("shopList.yandex")}</h3>
      </Card>
      <Card className="transfer-card">
        <Avatar
          style={{ backgroundColor: "#0dc367" }}
          size={64}
          src={perekrestokLogo}
        />
        <h3>{t("shopList.perekrestok")}</h3>
      </Card>
      <Card className="transfer-card">
        <Avatar
          style={{ backgroundColor: "#f7931a" }}
          size={64}
          src={dsLogo}
        />
        <h3>{t("shopList.ds")}</h3>
      </Card>
    </>
  );
});

export default Shops;
