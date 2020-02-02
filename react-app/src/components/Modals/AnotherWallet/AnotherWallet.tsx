import "./AnotherWallet.scss";

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
import { useDebounce } from "use-debounce";

import { sendTx, estimateCommission } from "../../../services/tx";
import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";
import { getProfile } from "../../../services/walletApi";

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
      hash: "",
      profile: "",
      loadProfile: false,
      profileImg: "",
      maxVal: 0
    });

    const [payload] = useDebounce(state.payload, 500);

    const mxRegExp = /^Mx[a-km-zA-HJ-NP-Z0-9]{40}$/gim;

    useEffect(() => {
      setState({ ...state, visible, coin: store.balance[0]?.coin, amount: store.balance[0]?.value });
    }, [visible]);

    useEffect(() => {
      const r = async () => {
        setState({ ...state, loadProfile: true });
        try {
          let res = await getProfile(state.address);
          if (!state.success) {
            setState({
              ...state,
              profile: res.data?.title,
              profileImg: res.data?.icon,
              loadProfile: false
            });
          }
        } catch (error) {
          setState({...state, profile: '', profileImg: '', loadProfile: false})
        }
      };
      if (state.address.length === 42) {
        r();
      }
    }, [state.address]);

    useEffect(() => {
      const setMax = async () => {
        let r = await estimateCommission(
          state.coin,
          state.amount,
          state.payload
        );
        let max =
          Math.floor(
            (store.balance.find(x => x.coin === state.coin)?.value! -
              r -
              0.001) *
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
    }, [state.coin, payload, store.balance]);

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
        setState({
          ...state,
          success: true,
          hash: res,
          loading: false
        });
        store.checkBalancesTimeout(6500);
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
        wrapClassName="another-wallet"
        maskClosable={false}
        visible={state.visible}
        title={t("anotherWallet.title")}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={() => {
          setState({ ...state, loading: false });
        }}
        footer={
          !state.success && (
            <>
              <Button key="back" onClick={handleCancel}>
                {t("anotherWallet.cancel")}
              </Button>
              ,
              <Button
                disabled={!mxRegExp.test(state.address) || state.loadProfile}
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
            <Alert type="success" style={{marginBottom: '20px'}} message={t("anotherWallet.content1")} />
            <div className="send-form">
              <div className="coin-val">
                <div className="coin">
                  <label>{t("anotherWallet.coin")}</label>
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
                  <label>{t("anotherWallet.value")}</label>
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
                <label>{t("anotherWallet.address")}</label>
                <Input
                  placeholder="Mx..."
                  value={state.address}
                  onChange={e =>
                    setState({ ...state, address: e.target.value })
                  }
                  maxLength={42}
                  addonAfter={
                    <>
                      {state.address.length == 42 &&
                        !state.loadProfile &&
                        state.profile !== "" && (
                          <span>
                            {state.profile} <img src={state.profileImg} />
                          </span>
                        )}
                      {state.address.length == 42 &&
                        !state.loadProfile &&
                        state.profile === "" && <span>Anonim</span>}
                      {state.address.length == 42 && state.loadProfile && (
                        <>
                          Loading Info... <Icon type="loading" />
                        </>
                      )}
                    </>
                  }
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
