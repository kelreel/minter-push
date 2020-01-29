import "./TimeLoop.scss";

import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Select,
  Icon
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { sendTx, sendTimeTx } from "../../../services/tx";
import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";

const TimeLoop: React.FC<{ visible: boolean }> = observer(
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
      secret: Math.random().toString(36).substring(2, 15)
    });


    useEffect(() => {
      setState({ ...state, visible, coin: store.balance[0]?.coin });
    }, [visible]);

    const { t, i18n } = useTranslation();

    const handleOk = async () => {
      setState({ ...state, loading: true });
      try {
        let res = await sendTimeTx(state.coin, state.amount, state.secret)
        setState({ ...state, success: true, hash: res, loading: false });
      } catch (error) {
        console.log(error);
        setState({ ...state, loading: false });
        message.error(error?.response?.data?.error?.tx_result?.message);
      }
    };

    const handleCancel = () => {
      setState({ ...state, visible: false, success: false, hash: "" });
    };

    return (
      <Modal
        destroyOnClose={true}
        wrapClassName="timeloop"
        maskClosable={false}
        visible={state.visible}
        title={t("timeloop.title")}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          !state.success && (
            <>
              <Button key="back" onClick={handleCancel}>
                {t("timeloop.cancel")}
              </Button>
              ,
              <Button
                disabled={state.amount === 0}
                key="submit"
                type="primary"
                loading={state.loading}
                onClick={handleOk}
              >
                {t("timeloop.send")}
              </Button>
            </>
          )
        }
      >
        {store.balance && !state.success && (
          <>
            <p>{t("timeloop.content1")}</p>
            <div className="send-form">
              <div className="coin-val">
                <div className="coin">
                  <label>{t("timeloop.coin")}</label>
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
                  <label>{t("timeloop.value")}</label>
                  <InputNumber
                    min={0}
                    max={
                      store.balance.find(x => x.coin === state.coin)?.value! -
                        0.1 >
                      0
                        ? store.balance.find(x => x.coin === state.coin)
                            ?.value! - 0.1
                        : 0
                    }
                    value={state.amount}
                    // @ts-ignore
                    onChange={val => setState({ ...state, amount: val })}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {!state.success && !store.balance && <Loading size="50px" />}
        {state.success && (
          <Result
            status="success"
            subTitle={t("timeloop.success")}
            extra={
              <a
                href={`https://timeloop.games/?gift=${state.secret}`}
                target="_blank"
              >
                {`https://timeloop.games/?gift=${state.secret}`}
              </a>
            }
          />
        )}
      </Modal>
    );
  }
);

export default TimeLoop;
