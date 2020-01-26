import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./WalletCreated.scss";

import { Tabs, Icon, message, Alert, Button, List, Modal } from "antd";
import { shortAddress, getDeepLink } from "../../services/utils";

import copy from "copy-to-clipboard";
import Loading from "../Layout/Loading";
import Title from "antd/lib/skeleton/Title";
import config from "../../config";
import { getBalance } from "../../services/createWaleltApi";
import { isMobile } from "react-device-detect";

var QRCodeCanvas = require("qrcode.react");

type props = {
  address: string;
  seed: string;
  link: string;
  password: string;
};

function useInterval(callback: Function, delay: number) {
  const savedCallback = useRef();

  useEffect(() => {
    //@ts-ignore
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const WalletCreated: React.FC<props> = ({ address, seed, link, password }) => {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState<{ tab: string; balance: any }>({
    balance: null,
    tab: "1"
  });
  const { TabPane } = Tabs;

  const checkBalance = async () => {
    try {
      let res = await getBalance(address);
      if (
        parseInt(res?.data?.result?.balance?.bip) > 0 ||
        Object.keys(res?.data?.result?.balance).length > 1
      ) {
        let balances = res?.data?.result?.balance;
        setState({ ...state, balance: balances });
      }
    } catch (error) {
      message.error("Error while updating balance");
      console.log(error);
    }
  };

  useInterval(checkBalance, 5000);

  const copyAddress = () => {
    copy(address);
    message.success(t("walletCreated.copyAddressSuccess"));
  };

  const copySeed = () => {
    copy(seed);
    message.success(t("walletCreated.copySeedSuccess"));
  };

  const copyLink = () => {
    copy(`${config.domain}${link}`);
    message.success(t("walletCreated.copyLinkSuccess"));
  };

  const copyPassword = () => {
    copy(password);
    message.success(t("walletCreated.copyPassSuccess"));
  };

  const getBalances = () => {
    let res = [];
    for (let key in state.balance) {
      res.push({
        coin: key,
        value:
          Math.round(
            (parseFloat(state.balance[key]) / 1000000000000000000) * 100
          ) / 100
      });
      res.sort((a, b) => {
        if (a.value > b.value) return -1;
        else return 1;
      });
    }
    return res;
  };

  return (
    <div className="card-container">
      <Tabs
        activeKey={state.tab}
        type="card"
        defaultActiveKey="1"
        onChange={val => setState({ ...state, tab: val })}
      >
        {/* Payment Tab */}
        <TabPane
          tab={
            <span>
              <Icon type="dollar" />
              {t("walletCreated.tab1title")}
            </span>
          }
          key="1"
        >
          <QRCodeCanvas value={address} onClick={copyAddress} size={200} />
          <div className="address" onClick={copyAddress}>
            {shortAddress(address)}
            <Icon type="copy" />
          </div>
          <div className="balance">
            {state.balance && (
              <>
                <h4>{t("walletCreated.currentBalance")}</h4>
                <List
                  size="small"
                  bordered
                  dataSource={getBalances()}
                  renderItem={item => (
                    <List.Item>
                      <p>{item.coin} </p> <p>{item.value}</p>
                    </List.Item>
                  )}
                />
              </>
            )}
            {!state.balance && (
              <>
                {isMobile &&
                <a
                  className="ant-btn ant-btn-primary"
                  href={getDeepLink(address)}
                  target="_blank"
                  type="primary"
                  style={{marginBottom: '15px'}}
                >
                  Pay via Link
                </a>}
                <h4>{t("walletCreated.waitingPayment")}</h4>
                <Loading size="50px" />
              </>
            )}
          </div>
          {/* <Button size="small" onClick={copySeed}>
            {t("walletCreated.copySeedBtn")}
          </Button> */}
        </TabPane>

        {/* Sharing Tab */}
        <TabPane
          tab={
            <span>
              <Icon type="link" />
              {t("walletCreated.tab2title")}
            </span>
          }
          key="2"
        >
          <div className="share">
            <QRCodeCanvas
              value={`${config.domain}${link}`}
              onClick={copyLink}
              size={200}
            />
            <p className="click-copy">{t("walletCreated.clickLink")}</p>
            <div onClick={copyLink} className="link">
              <Alert message={`${config.domain}${link}`} type="success" />
            </div>
            <p className="click-copy">{t("walletCreated.mnemonic")}</p>
            <div onClick={copySeed} className="seed">
              <Alert message={seed} type="success" />
            </div>
            {password !== "" && (
              <>
                <p className="click-copy">{t("walletCreated.password")}</p>
                <div onClick={copyPassword} className="pass">
                  <Alert message={password} type="warning" />
                </div>
              </>
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Next, back buttons */}
      {state.tab === "1" ? (
        <p onClick={() => setState({ ...state, tab: "2" })} className="nav">
          {t("walletCreated.next")}
        </p>
      ) : (
        <p onClick={() => setState({ ...state, tab: "1" })} className="nav">
          {t("walletCreated.back")}
        </p>
      )}
    </div>
  );
};

export default WalletCreated;
