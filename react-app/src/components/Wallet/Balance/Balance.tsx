import "./Balance.scss";

import {Alert, Layout, List, Icon, Button} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";

import {AppStoreContext} from "../../../stores/appStore";
import Loading from "../../Layout/Loading";
import {PresetStoreContext} from "../../../stores/presetStore";

const {Content} = Layout;

const Balance: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext)
  const {t, i18n} = useTranslation();

  if (store.status === 'created' && store.totalBipBalance === 0) {
    return (
      <div className="balance">
        <Loading size="50px"/>
        <h3>Activating wallet...</h3>
      </div>
    )
  } else {
    return (
      <div className="balance">
        {store.fromName ? (
          <div className="from">
            <span className="name">{store.fromName}</span>{" "}
            <span className="sended">{t("balance.sentYou")}</span>
          </div>
        ) : (
          <div className="from">
            <span className="sended">{t("balance.youReceive")}</span>
          </div>
        )}
        {store.balance.length === 0 && (
          <div className="one-coin">
            <div className="price">~ 0 {store.currency}</div>
          </div>
        )}
        {store.balance.length === 1 && (
          <div className="one-coin">
            <div className="value">
              {store.balance[0].value.toLocaleString("ru-RU")}{" "}
              <span className="coin">{store.balance[0].coin}</span>
            </div>
            {pStore.showLocalBalance && <div className="price">
                ~ {store.totalInLocalCurrency.toLocaleString("ru-RU")}{" "}
              {store.currency}
            </div>}
          </div>
        )}
        {store.balance.length > 1 && (
          <div className="coin-list">
            {pStore.showLocalBalance && <div className="value">
                ~ {store.totalInLocalCurrency.toLocaleString("ru-RU")}{" "}
              {store.currency}
            </div>}
            <List
              size="small"
              bordered
              dataSource={store.balance}
              renderItem={item => (
                <List.Item>
                  <span className="coin">{item.coin}</span>
                  <div className="right">
                    <span className="val">{item.value}</span>
                    <span className="price">
                    (~
                      {(
                        Math.round(
                          item.bip_value! * store.bipPrice * 100 * store.rates[store.currency]
                        ) / 100
                      ).toLocaleString("ru-RU")}{" "}
                      {store.currency})
                  </span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
        {pStore.showPayload && store.payload && (
          <Alert closable message={store.payload} type="success"/>
        )}
        {/* <Icon className="down" style={{ marginTop: "20px" }} type="down" /> */}
        {/* <Button
          shape="circle"
          icon="arrow-down"
          style={{ marginTop: "20px" }}
        /> */}
      </div>
    );
  }
});

export default Balance;
