import "./History.scss";

import { Button, Icon, Layout, Tag } from "antd";
import Title from "antd/lib/typography/Title";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "../../components/Layout/Loading";
import { statusColor } from "../../components/Multi/Main/WalletTable";
import config from "../../config";
import { getStatus } from "../../services/walletApi";
import {
  getWalletsHistory,
  historyEntryType
} from "../../services/walletsHistory";
import { AppStoreContext } from "../../stores/appStore";
import history from "../../stores/history";

const { Content } = Layout;

const HistoryView: React.FC = observer(() => {
  const [state, setState] = useState({
    history: getWalletsHistory(),
    loading: false
  });

  useEffect(() => {
    let r = async () => {
      if (!getWalletsHistory()) return;
      setState({ ...state, loading: true });
      let res = [];
      for (let item of state.history!) {
        if (item.type === historyEntryType.multi) {
          res.push(item);
        } else {
          try {
            let status = await getStatus(item.link);
            res.push({ ...item, status: status.data });
          } catch (error) {
            res.push(item);
          }
        }
      }
      setState({ ...state, history: res, loading: false });
      document.title = `Push History`;
    };
    r();
    console.log(state);
    return function cleanTitle() {
      document.title = "Push";
    };
  }, []);

  const getList = () => {
    return state.history?.map(item => {
      if (item.type === historyEntryType.push) {
        return (
          <div key={item.link} className="item wallet">
            <div className="row">
              <div className="name">{item.link}</div>
              <div className="row">
                {item.status && (
                  <div className="status">
                    <Tag color={statusColor(item.status.status)}>
                      {item.status.status.toUpperCase()}
                    </Tag>
                  </div>
                )}
                <Button
                  size="small"
                  onClick={() =>
                    window.open(`${config.domain}${item.link}`, "_blank")
                  }
                >
                  Open
                </Button>
              </div>
            </div>
            {item.password && (
              <div className="label">Password: {item.password}</div>
            )}
            {item.date && (
              <div className="label">
                {new Date(item.date).toLocaleString()}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div key={item.link} className="item campaign">
            <div className="row">
              <div className="name">
                <Icon style={{ marginRight: "5px" }} type="share-alt" />
                Campaign: {item.link}
              </div>
              <Button
                size="small"
                onClick={() =>
                  window.open(`${config.domain}multi/${item.link}`, "_blank")
                }
              >
                Open
              </Button>
            </div>
            {item.password && (
              <div className="label">Password: {item.password}</div>
            )}
          </div>
        );
      }
    });
  };

  return (
    <Content className="history-view">
      <Title
        level={3}
        style={{ marginBottom: "35px" }}
        className="animated fadeIn"
      >
        History
      </Title>
      {!state.history && (
        <Button onClick={() => history.push("/")}>Create Push</Button>
      )}
      {state.loading ? (
        <Loading size="50px" />
      ) : (
        <div className="list animated fadeIn">{getList()}</div>
      )}
    </Content>
  );
});

export default HistoryView;
