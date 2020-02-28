import "./WalletCreated.scss";

import {Alert, Button, Icon, InputNumber, List, message, Modal, Select, Tabs} from "antd";
import copy from "copy-to-clipboard";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

import config from "../../config";
import {getBalance} from "../../services/createWaleltApi";
import {getDeepLink, shortAddress} from "../../services/utils";
import Loading from "../Layout/Loading";

import * as Share from "react-share";
import qrlogo from "../../assets/qr.png";
import {AppStoreContext} from "../../stores/appStore";
import {log} from "util";

var QRCodeCanvas = require("qrcode.react");

type props = {
  address: string;
  link: string;
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

const WalletCreated: React.FC<props> = ({address, link}) => {
  const {t, i18n} = useTranslation();
  const store = useContext(AppStoreContext)
  const [state, setState] = useState<{ tab: string; balance: any, deepModal: boolean, deepValue: number, deepCurrency: string }>({
    balance: null,
    tab: "1",
    deepModal: false,
    deepValue: 10,
    deepCurrency: store.currency
  });
  const {TabPane} = Tabs;

  const checkBalance = async () => {
    try {
      let res = await getBalance(address);
      if (
        parseInt(res?.data?.result?.balance?.bip) > 0 ||
        Object.keys(res?.data?.result?.balance).length >= 1
      ) {
        let balances = res?.data?.result?.balance;
        setState({...state, balance: balances});
      }
    } catch (error) {
      message.error("Error while updating balance");
      console.log(error);
    }
  };

  useInterval(checkBalance, 5000);

  useEffect(() => {
    checkBalance()
  }, [])

  const copyAddress = () => {
    copy(address);
    message.success(t("walletCreated.copyAddressSuccess"));
  };

  const copyLink = () => {
    copy(`${config.domain}${link}`);
    message.success(t("walletCreated.copyLinkSuccess"));
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

  const deepBip = Math.round((1 / store.bipPrice) / store.rates[state.deepCurrency] * state.deepValue * 100) / 100;

  return (
    <div className="card-container">
      <Tabs
        activeKey={state.tab}
        type="card"
        defaultActiveKey="1"
        onChange={val => setState({...state, tab: val})}
      >
        {/* Payment Tab */}
        <TabPane
          tab={
            <span>
              <Icon type="dollar"/>
              {t("walletCreated.tab1title")}
            </span>
          }
          key="1"
        >
          <QRCodeCanvas value={address} onClick={copyAddress} size={200}/>
          <div className="address" onClick={copyAddress}>
            {shortAddress(address)}
            <Icon type="copy"/>
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
                      </div>
                      {" "}
                      <p>{item.value}</p>
                    </List.Item>
                  )}
                />
              </>
            )}
            {(!state.balance ||
              (+state?.balance?.BIP === 0 && getBalances().length === 1)) && (
              <>
                <Button
                  type="primary"
                  onClick={() => setState({...state, deepModal: true})}
                  style={{marginBottom: "15px"}}
                >
                  {t("walletCreated.exact")}
                </Button>
                <h4>{t("walletCreated.waitingPayment")}</h4>
                <Loading size="50px"/>
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
              <Icon type="link"/>
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
            <p style={{alignSelf: "center"}} className="click-copy">
              {t("walletCreated.clickLink")}
            </p>
            <div onClick={copyLink} className="link">
              <Alert message={`${config.domain}${link}`} type="success"/>
            </div>
            <div className="share-buttons">
              <Share.VKShareButton url={`${config.domain}${link}`}>
                <Share.VKIcon size={32} round={true}/>
              </Share.VKShareButton>
              <Share.TelegramShareButton url={`${config.domain}${link}`}>
                <Share.TelegramIcon size={32} round={true}/>
              </Share.TelegramShareButton>
              <Share.ViberShareButton url={`${config.domain}${link}`}>
                <Share.ViberIcon size={32} round={true}/>
              </Share.ViberShareButton>
              <Share.WhatsappShareButton url={`${config.domain}${link}`}>
                <Share.WhatsappIcon size={32} round={true}/>
              </Share.WhatsappShareButton>
              <Share.EmailShareButton url={`${config.domain}${link}`}>
                <Share.EmailIcon size={32} round={true}/>
              </Share.EmailShareButton>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title="Deep Link"
        wrapClassName="deep-modal"
        visible={state.deepModal}
        onCancel={() => setState({...state, deepModal: false})}
        footer={
          <>
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                window.open(getDeepLink(address, deepBip, 'BIP'), '_blank');
                setState({...state, deepModal: false})
              }}
            >
              {t("walletCreated.pay")}
            </Button>
          </>
        }
      >
        <p>{t("walletCreated.deepContent")}</p>
        <div className="deep-value">
          <InputNumber className="num" min={0} value={state.deepValue}
                       onChange={(val) => setState({...state, deepValue: val!})}/>
          <Select className="cur" value={state.deepCurrency}
                  onChange={(val: string) => setState({...state, deepCurrency: val})}>
            <Select.Option value="USD">USD</Select.Option>
            <Select.Option value="RUB">RUB</Select.Option>
          </Select>
        </div>
        <div className="value">
          {deepBip.toLocaleString()} BIP
        </div>
      </Modal>

      {/* Next, back buttons */}
      <div className="nav">

        {state.tab === "1" ? (
          <Button onClick={() => setState({...state, tab: "2"})}>
            {t("walletCreated.next")}
          </Button>
        ) : (
          <Button onClick={() => setState({...state, tab: "1"})}>
            {t("walletCreated.back")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCreated;
