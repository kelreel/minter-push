import { Layout, List, Skeleton, Alert } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../../stores/appStore";
import "./Balance.scss";
import Loading from "../../Layout/Loading";

const { Content } = Layout;

const Balance: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  if (store.isLoading === false) {
    return (
      <div className="balance">
        {store.fromName && (
          <div className="from">
            <span className="name">{store.fromName}</span>{" "}
            <span className="sended">{t("balance.sentYou")}</span>
          </div>
        )}
        {store.balance.length === 1 && (
          <div className="one-coin">
            <div className="value">
              {store.balance[0].value.toLocaleString("ru-RU")}{" "}
              <span className="coin">{store.balance[0].coin}</span>
            </div>
            <div className="price">
              ~ {store.totalInLocalCurrency.toLocaleString("ru-RU")}{" "}
              {store.currency}
            </div>
          </div>
        )}
        {store.balance.length > 1 && (
          <div className="coin-list">
            <div className="value">
              ~ {store.totalInLocalCurrency.toLocaleString("ru-RU")}{" "}
              {store.currency}
            </div>
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
                          item.bip_value! *
                            store.bipPrice *
                            100 *
                            store.exchRate
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
        <Alert closable message={store.payload} type="success" />
      </div>
    );
  } else {
    return (
      <div className="balance">
        <Loading size="80px" />
      </div>
    );
  }
});

export default Balance;
