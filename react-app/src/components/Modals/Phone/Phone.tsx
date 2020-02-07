import "./Phone.scss";

import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Select,
  Alert
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getInfo, getKeyword } from "../../../services/bipToPhoneApi";
import { estimateCommission, sendMobileTx } from "../../../services/tx";
import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";
import { setTouched } from "../../../services/walletApi";

const Phone: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const store = useContext(AppStoreContext);
  
  const [state, setState] = useState({
    visible,
    loading: false,
    coin: "",
    amount: 0,
    payload: "",
    success: false,
    hash: "",
    phone: "",
    maxLimit: 0,
    bipPrice: 0,
    maxVal: 0,
    loadInfo: false
  });

  useEffect(() => {
    setState({
      ...state,
      visible,
      coin: store.balance[0]?.coin,
      amount: store.balance[0]?.value
    });
    const f = async () => {
      setState({...state, loadInfo: true})
      let r = await getInfo();
      setState({
        ...state,
        visible,
        coin: store.balance[0]?.coin,
        maxLimit: r.data.LIMIT,
        bipPrice: r.data.RUB,
        loadInfo: false
      });
      console.log(r.data.RUB);
      
    };
    if (visible) {
      f();
    }
  }, [visible]);

  useEffect(() => {
    const setMax = async () => {
      let r = await estimateCommission(
        state.coin,
        state.amount,
        "a".repeat(12)
      );

      let max =
        Math.floor(
          (store.balance.find(x => x.coin === state.coin)?.value! - r - 0.001) *
            100
        ) /
          100 >
        0
          ? Math.floor(
              (store.balance.find(x => x.coin === state.coin)?.value! -
                r -
                0.001) *
                100
            ) / 100
          : 0;
      setState({
        ...state,
        maxVal: max
      });
    };
    if (state.coin && state.coin !== "") {
      setMax();
    }
  }, [state.coin, store.balance]);

  const { t, i18n } = useTranslation();

  const handleOk = async () => {
    setState({ ...state, loading: true });
    try {
      let keyword = await getKeyword(state.phone);
      let tx = await sendMobileTx(
        state.coin,
        state.amount,
        keyword.data.keyword
      );
      setState({ ...state, success: true, hash: tx });
      setTouched(store.link!)
      store.checkBalancesTimeout(6500);
    } catch (error) {
      message.error(error.message);
      setState({ ...state, loading: false });
    }
  };

  const handleCancel = () => {
    setState({ ...state, visible: false, success: false, hash: "" });
  };

  const phoneRegexp = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

  return (
    <Modal
      destroyOnClose={true}
      wrapClassName="phone"
      maskClosable={false}
      visible={state.visible}
      title={t("phone.title")}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        !state.success && (
          <>
            <Button key="back" onClick={handleCancel}>
              {t("phone.cancel")}
            </Button>
            ,
            <Button
              disabled={!phoneRegexp.test(state.phone)}
              key="submit"
              type="primary"
              loading={state.loading}
              onClick={handleOk}
            >
              {t("phone.send")}
            </Button>
          </>
        )
      }
    >
      {store.balance && !state.success && (
        <>
          <Alert
            type="success"
            style={{ marginBottom: "20px" }}
            message={t("phone.content2")}
          />
          <p>
            {t("phone.max")} {state.maxLimit} RUB
          </p>
          <div className="send-form">
            <div className="coin-val">
              <div className="coin">
                <label>{t("phone.coin")}</label>
                <Select
                  value={state.coin}
                  onChange={(val: string) => {
                    setState({
                      ...state,
                      coin: val,
                      amount: store.balance.find(x => x.coin === val)?.value!
                    });
                  }}
                >
                  {store.balance.map(item => {
                    return (
                      <Select.Option key={item.coin} value={item.coin}>
                        {item.coin} ({item.value})
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div className="amount">
                <label>{t("phone.value")}</label>
                <InputNumber
                  min={0}
                  autoFocus
                  max={state.maxVal}
                  value={state.amount}
                  // @ts-ignore
                  onChange={val => setState({ ...state, amount: val })}
                />
              </div>
            </div>
            <div className="field">
              <label>{t("phone.phoneNumber")}</label>
              <Input
                placeholder="+7-909-111-22-33"
                value={state.phone}
                onChange={e => setState({ ...state, phone: e.target.value })}
                maxLength={12}
              />
            </div>
            {/* {state.loadInfo ? 'load' : 'not load'}
            {state.bipPrice} */}
            {!state.loadInfo && state.amount > 0 && (
              <div className="total">
                {t("phone.total")}{" "}
                {state.coin === "BIP" && (
                  <p>{Math.round(state.amount * state.bipPrice * 100) / 100}</p>
                )}
                {state.coin !== "BIP" && (
                  <p>
                    {Math.round(
                      state.amount *
                        (store.balance.find(x => x.coin === state.coin)
                          ?.value! /
                          store.balance.find(x => x.coin === state.coin)
                            ?.value!) *
                        state.bipPrice *
                        100
                    ) / 100}
                  </p>
                )}
                <p>RUB</p>
              </div>
            )}
          </div>
        </>
      )}
      {!state.success && !store.balance && <Loading size="50px" />}
      {state.success && (
        <Result
          status="success"
          title={t("phone.success")}
          subTitle={t("phone.successSub")}
          extra={
            <a
              href={`https://minterscan.net/tx/${state.hash}`}
              target="_blank"
              className="ant-btn ant-btn-primary"
            >
              Explorer
            </a>
          }
        />
      )}
    </Modal>
  );
});

export default Phone;
