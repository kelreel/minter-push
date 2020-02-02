import "./Bitcoin.scss";

import {
  Alert,
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Select
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";
import { estimateCommission } from "../../../services/tx";

const Bitcoin: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const store = useContext(AppStoreContext);

  const [state, setState] = useState({
    visible,
    loading: false,
    coin: "",
    address: "",
    amount: 0,
    payload: "",
    success: false,
    hash: "",
    maxVal: 0
  });

  useEffect(() => {
    setState({ ...state, visible, coin: store.balance[0]?.coin });
  }, [visible]);

  useEffect(() => {
    const setMax = async () => {
      let r = await estimateCommission(state.coin, state.amount, state.payload);
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
        maxVal: max > 0 ? max : 0
      });
    };
    if (state.coin && state.coin !== "") {
      setMax();
    }
  }, [state.coin, store.balance]);

  const { t, i18n } = useTranslation();

  const handleOk = async () => {
    setState({ ...state, visible: false });
  };

  const handleCancel = () => {
    setState({ ...state, visible: false, success: false, hash: "" });
  };

  const btcRegExp = /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/gim;

  return (
    <Modal
      destroyOnClose={true}
      wrapClassName="bitcoin"
      maskClosable={false}
      visible={state.visible}
      title={t("bitcoin.title")}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        !state.success && (
          <>
            <Button key="back" onClick={handleCancel}>
              {t("bitcoin.cancel")}
            </Button>
            ,
            <Button
              disabled={!btcRegExp.test(state.address)}
              key="submit"
              type="primary"
              loading={state.loading}
              onClick={handleOk}
            >
              {t("bitcoin.send")}
            </Button>
          </>
        )
      }
    >
      {store.balance && !state.success && (
        <>
          <Alert
            style={{ marginBottom: "20px" }}
            type="warning"
            message={t("bitcoin.content1")}
          ></Alert>
          <div className="send-form">
            <div className="coin-val">
              <div className="coin">
                <label>{t("bitcoin.coin")}</label>
                <Select
                  value={state.coin}
                  onChange={(val: string) => {
                    setState({ ...state, coin: val });
                    setTimeout(() => {
                      console.log(state.coin);
                    }, 10);
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
                <label>{t("bitcoin.value")}</label>
                <InputNumber
                  min={0}
                  max={state.maxVal}
                  value={state.amount}
                  autoFocus
                  onChange={val => setState({ ...state, amount: val! })}
                />
              </div>
            </div>
            <div className="field">
              <label>{t("bitcoin.btcWallet")}</label>
              <Input
                placeholder="1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"
                value={state.address}
                onChange={e => setState({ ...state, address: e.target.value })}
                maxLength={33}
              />
            </div>
          </div>
        </>
      )}
      {!store.balance && <Loading size="50px" />}
    </Modal>
  );
});

export default Bitcoin;
