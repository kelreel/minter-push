import "./WalletCreated.scss";

import { Alert, Icon, List, message, Tabs, Button } from "antd";
import copy from "copy-to-clipboard";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

import config from "../../config";
import { getBalance } from "../../services/createWaleltApi";
import { getDeepLink, shortAddress } from "../../services/utils";
import Loading from "../Layout/Loading";

import * as Share from "react-share";
import qrlogo from "../../assets/qr.png";

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
        Object.keys(res?.data?.result?.balance).length >= 1
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
            {state.balance &&
              (+state.balance.BIP !== 0 || getBalances().length > 1) && (
                <>
                  <h4>{t("walletCreated.currentBalance")}</h4>
                  <List
                    size="small"
                    bordered
                    dataSource={getBalances()}
                    renderItem={item => (
                      <List.Item>
                        <div className="left">
                          <img
                            src={`${config.avatarCoinURL}${item.coin}`}
                            alt=""
                          />
                          <p>{item.coin} </p>
                        </div>{" "}
                        <p>{item.value}</p>
                      </List.Item>
                    )}
                  />
                </>
              )}
            {(!state.balance ||
              (+state?.balance?.BIP === 0 && getBalances().length === 1)) && (
              <>
                {isMobile && (
                  <a
                    className="ant-btn ant-btn-primary"
                    href={getDeepLink(address)}
                    target="_blank"
                    type="primary"
                    style={{ marginBottom: "15px" }}
                  >
                    DeepLink (100 BIP)
                  </a>
                )}
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
              size={220}
              includeMargin={true}
              imageSettings={{
                src: qrlogo,
                height: 23,
                width: 150,
                y: 170,
                excavate: true
              }}
            />
            <p style={{ alignSelf: "center" }} className="click-copy">
              {t("walletCreated.clickLink")}
            </p>
            <div onClick={copyLink} className="link">
              <Alert message={`${config.domain}${link}`} type="success" />
            </div>
            {password !== "" && (
              <>
                <p className="click-copy">{t("walletCreated.password")}</p>
                <div onClick={copyPassword} className="pass">
                  <Alert message={password} type="warning" />
                </div>
              </>
            )}
            <div className="share-buttons">
              <Share.VKShareButton url={`${config.domain}${link}`}>
                <Share.VKIcon size={32} round={true} />
              </Share.VKShareButton>
              <Share.TelegramShareButton url={`${config.domain}${link}`}>
                <Share.TelegramIcon size={32} round={true} />
              </Share.TelegramShareButton>
              <Share.ViberShareButton url={`${config.domain}${link}`}>
                <Share.ViberIcon size={32} round={true} />
              </Share.ViberShareButton>
              <Share.WhatsappShareButton url={`${config.domain}${link}`}>
                <Share.WhatsappIcon size={32} round={true} />
              </Share.WhatsappShareButton>
              <Share.EmailShareButton url={`${config.domain}${link}`}>
                <Share.EmailIcon size={32} round={true} />
              </Share.EmailShareButton>
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Next, back buttons */}
      <div className="nav">
        {state.tab === "1" ? (
          <Button onClick={() => setState({ ...state, tab: "2" })}>
            {t("walletCreated.next")}
          </Button>
        ) : (
          <Button onClick={() => setState({ ...state, tab: "1" })}>
            {t("walletCreated.back")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCreated;
