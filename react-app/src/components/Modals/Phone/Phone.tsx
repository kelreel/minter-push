import "./Phone.scss";

import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Select,
  Icon,
  Alert
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { sendTx } from "../../../services/tx";
import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";
import { getScoring } from "../../../services/walletApi";

const Phone: React.FC<{ visible: boolean }> = observer(
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
      hash: "",
      scoring: 0,
      name: "",
      loadScoring: false
    });

    const mxRegExp = /^Mx[a-km-zA-HJ-NP-Z0-9]{40}$/gim;

    useEffect(() => {
      setState({ ...state, visible, coin: store.balance[0]?.coin });
    }, [visible]);

    useEffect(() => {
      if (state.address.length === 42) {
        setState({ ...state, loadScoring: true });
        getScoring(state.address)
          .then(res => {
            setState({
              ...state,
              scoring: res.data.score,
              name: res.data?.profile?.title,
              loadScoring: false
            });
          })
          .catch(err => {
            console.log(err);
            setState({ ...state, loadScoring: false, name: "", scoring: 0 });
          });
      }
    }, [state.address]);

    const { t, i18n } = useTranslation();

    const handleOk = async () => {
      setState({ ...state, visible: false, success: false, hash: "" });
    };

    const handleCancel = () => {
      setState({ ...state, visible: false, success: false, hash: "" });
    };

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
                disabled={state.address.length < 11}
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
              style={{ marginBottom: "20px" }}
              type="warning"
              message={t("phone.content1")}
            ></Alert>
            <p>{t("phone.content2")}</p>
            <div className="send-form">
              <div className="coin-val">
                <div className="coin">
                  <label>{t("phone.coin")}</label>
                  <Select
                    value={state.coin}
                    onChange={(val: string) => {
                      setState({ ...state, coin: val });
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
                <label>{t("phone.phoneNumber")}</label>
                <Input
                  placeholder="+7-909-111-22-33"
                  value={state.address}
                  onChange={e =>
                    setState({ ...state, address: e.target.value })
                  }
                  maxLength={12}
                />
              </div>
            </div>
          </>
        )}
        {!state.success && !store.balance && <Loading size="50px" />}
        {state.success && (
          <Result
            status="success"
            title={t("phone.success")}
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

export default Phone;
