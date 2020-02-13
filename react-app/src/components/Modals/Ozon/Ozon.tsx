import "./Ozon.scss";

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

const Ozon: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const store = useContext(AppStoreContext);

  const [state, setState] = useState({
    visible,
    loading: false,
    certificate: "500",
    coin: ""
  });

  useEffect(() => {
    setState({ ...state, visible, coin: store.balance[0]?.coin });
  }, [visible]);

  const { t, i18n } = useTranslation();

  const handleOk = async () => {
    setState({ ...state, visible: false });
  };

  const handleCancel = () => {
    setState({ ...state, visible: false });
  };

  return (
    <Modal
      destroyOnClose={true}
      wrapClassName="ozon"
      maskClosable={false}
      visible={state.visible}
      title={t("ozon.title")}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          <Button key="back" onClick={handleCancel}>
            {t("ozon.cancel")}
          </Button>
          <Button
            disabled={!state.certificate || !state.coin}
            key="submit"
            type="primary"
            loading={state.loading}
            onClick={handleOk}
          >
            {t("ozon.send")}
          </Button>
        </>
      }
    >
      {store.balance && (
        <>
          <Alert
            style={{ marginBottom: "20px" }}
            type="warning"
            message={t("ozon.content1")}
          ></Alert>
          <div className="send-form">
            <div className="field">
              <label>{t("ozon.select")}</label>
              <Select
                value={state.certificate}
                onChange={(val: string) => {
                  setState({ ...state, certificate: val });
                }}
              >
                <Select.Option value={"500"}>500 Рублей</Select.Option>
                <Select.Option value={"1000"}>1000 Рублей</Select.Option>
                <Select.Option value={"2000"}>2000 Рублей</Select.Option>
                <Select.Option value={"5000"}>5000 Рублей</Select.Option>
              </Select>
            </div>
            <div className="field">
              <label>{t("ozon.coin")}</label>
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
            {state.coin && state.certificate && (
              <div className="price">
                {state.coin === "BIP" ? (
                  <>
                    <p>{t("ozon.price")}</p>
                    <p>
                      {Math.round(
                        (+state.certificate /
                          store.rubCourse /
                          store.bipPrice) *
                          100
                      ) / 100}{" "}
                      {state.coin}
                    </p>
                  </>
                ) : (
                  <>
                    <p>{t("ozon.price")}</p>
                    <p>
                      {Math.round(
                        (+state.certificate /
                          store.rubCourse /
                          store.bipPrice) *
                          // @ts-ignore
                          (store.balance.find(x => x.coin === state.coin)
                            ?.value /
                            // @ts-ignore
                            store.balance.find(x => x.coin === state.coin)
                              ?.bip_value) *
                          100
                      ) / 100}{" "}
                      {state.coin}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {!store.balance && <Loading size="50px" />}
    </Modal>
  );
});

export default Ozon;
