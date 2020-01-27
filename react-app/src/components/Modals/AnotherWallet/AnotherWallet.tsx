import "./AnotherWallet.scss";

import {
  Button,
  Modal,
  Select,
  Input,
  InputNumber,
  message,
  Result
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";
import { sendTx } from "../../../services/tx";

const AnotherWallet: React.FC<{ visible: boolean }> = observer(
  ({ visible }) => {
    const store = useContext(AppStoreContext);

    const [state, setState] = useState({
      visible,
      loading: false,
      coin: "",
      address: "",
      amount: 0,
      payload: "",
      success: false,
      hash: ""
    });

    useEffect(() => {
      setState({ ...state, visible, coin: store.balance[0]?.coin });
    }, [visible]);

    const { t, i18n } = useTranslation();

    const handleOk = async () => {
      setState({ ...state, loading: true });
      try {
        let res = await sendTx(
          state.address,
          state.coin,
          state.amount,
          state.payload
        );
        setState({ ...state, success: true, hash: res, loading: false });
      } catch (error) {
        console.log(error);
        setState({ ...state, loading: false });
        message.error(error?.response?.data?.error?.tx_result?.message);
      }
    };

    const handleCancel = () => {
      setState({ ...state, visible: false, success: false, hash: '' });
    };

    return (
      <Modal
        destroyOnClose={true}
        wrapClassName="another-wallet"
        maskClosable={false}
        visible={state.visible}
        title={t("anotherWallet.title")}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          !state.success && (
            <>
              <Button key="back" onClick={handleCancel}>
                {t("anotherWallet.cancel")}
              </Button>
              ,
              <Button
                disabled={state.address.length !== 42}
                key="submit"
                type="primary"
                loading={state.loading}
                onClick={handleOk}
              >
                {t("anotherWallet.send")}
              </Button>
            </>
          )
        }
      >
        {store.balance && !state.success && (
          <>
            <p>{t("anotherWallet.content1")}</p>
            <div className="send-form">
              <div className="coin-val">
                <div className="coin">
                  <label>{t("anotherWallet.coin")}</label>
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
                  <label>{t("anotherWallet.value")}</label>
                  <InputNumber
                    min={0}
                    max={
                      store.balance.find(x => x.coin === state.coin)?.value! -
                        0.1 || 0
                    }
                    value={state.amount}
                    // @ts-ignore
                    onChange={val => setState({ ...state, amount: val })}
                  />
                </div>
              </div>
              <div className="field">
                <label>{t("anotherWallet.address")}</label>
                <Input
                  placeholder="Mx..."
                  value={state.address}
                  onChange={e =>
                    setState({ ...state, address: e.target.value })
                  }
                  maxLength={42}
                />
              </div>
              <div className="field">
                <label>{t("anotherWallet.payload")}</label>
                <Input
                  placeholder="You message here"
                  value={state.payload}
                  maxLength={120}
                  onChange={e =>
                    setState({ ...state, payload: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        )}
        {!state.success && !store.balance && <Loading size="50px" />}
        {state.success && (
          <Result
            status="success"
            title={t("anotherWallet.success")}
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
  }
);

export default AnotherWallet;
