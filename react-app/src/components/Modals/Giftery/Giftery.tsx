import "./Giftery.scss";

import {Button, Input, message, Modal, Result, Select} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import parse from 'html-react-parser';

import {AppStoreContext} from "../../../stores/appStore";
import {getCertificate, makeOrder} from "../../../services/gifteryApi";
import {saveAs} from "file-saver";
import {b64toBlob} from "../../../services/utils";
import {setTouched} from "../../../services/walletApi";

type Props = {
  visible: boolean,
  id: number,
  title: string,
  brief: string,
  face_step: number,
  digital_acceptance: string,
  face_min: number,
  faces: number[],
  face_max: number,
  image_url: string,
  disclaimer: string
}

const mailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const Giftery: React.FC<Props> = observer((
  {
    visible,
    id,
    title,
    brief,
    face_step,
    digital_acceptance,
    face_min,
    face_max,
    image_url,
    disclaimer,
    faces,
  }) => {

  const store = useContext(AppStoreContext);
  const {t, i18n} = useTranslation();

  const initialState = {
    visible,
    face: face_min,
    coin: "",
    email: "",
    success: false,
    error: false,
    order: null,
    isLoading: false
  }

  const [state, setState] = useState(initialState);

  const getPDF = async (id: string) => {
    try {
      let res = await getCertificate(id)
      saveAs(b64toBlob(res.data, 'application/pdf'), `${title}-${state.face}.pdf`);
      // saveAs(atob(res.data), '123.pdf', )
    } catch (error) {
      console.log(error)
      message.error("Error while getting PDF");
    }
  };

  useEffect(() => {
    if (visible === false) {
      setState(initialState)
    } else {
      setState({...state, visible, coin: store.balance[0]?.coin, face: face_min});
    }
  }, [visible]);

  const handleOk = async () => {
    setState({...state, isLoading: true});
    try {
      let res = await makeOrder(store.link!, id, state.face, state.email, store.seed!, state.coin);
      setState({...state, success: true, order: res.data.order, isLoading: false})
      setTouched(store.link!);
      store.checkBalancesTimeout(6500);
    } catch (error) {
      const {response} = error;
      response ? message.error(response.data) : message.error(error);
      setState({...state, error: response.data, isLoading: false})
    }
  };

  const handleCancel = () => {
    setState({...state, visible: false});
  };

  return (
    <Modal
      destroyOnClose={true}
      wrapClassName="giftery-wrapper"
      maskClosable={false}
      visible={state.visible}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      bodyStyle={{backgroundImage: `linear-gradient(rgba(255,255,255,.97), rgba(255,255,255,.97)), url(https://${image_url})`}}
      footer={
        !state.error && !state.success && <>
          <Button key="back" onClick={handleCancel}>
            {t("giftery.modal.cancel")}
          </Button>
              <Button
                  disabled={!state.face || !state.coin || !mailRegExp.test(state.email)}
                  key="submit"
                  type="primary"
                  loading={state.isLoading}
                  onClick={handleOk}
              >
                {t("giftery.modal.next")}
              </Button>
        </>
      }
    >
      <>
        {!state.error && !state.success && <div className="send-form">
            <div className="field">
                <label>{t("giftery.modal.certificate")}</label>
                <Select
                    value={state.face.toString() + " RUB"}
                    onChange={(val: string) => {
                      setState({...state, face: parseInt(val)});
                    }}
                >
                  {faces.map((item) => <Select.Option value={item} key={item}>{item} RUB</Select.Option>)}
                </Select>
            </div>
            <div className="field">
                <label>{t("giftery.modal.coin")}</label>
                <Select
                    value={state.coin}
                    onChange={(val: string) => {
                      setState({...state, coin: val});
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
            <div className="field">
                <label>{t("giftery.modal.email")}</label>
                <Input placeholder="hello@mail.com" value={state.email} onChange={(e) => {
                  setState({...state, email: e.target.value})
                }
                }/>
            </div>
          {state.coin && state.face !== 0 && (
            <div className="price">
              {state.coin === "BIP" ? (
                <>
                  <p>{t("giftery.modal.price")}</p>
                  <p>
                    {Math.round(
                      (+state.face /
                        store.rubCourse /
                        store.bipPrice) *
                      100
                    ) / 100}{" "}
                    {state.coin}
                  </p>
                </>
              ) : (
                <>
                  <p>{t("giftery.modal.price")}</p>
                  <p>
                    {Math.round(
                      (+state.face /
                        store.rubCourse /
                        store.rates.price1001) *
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
            <div className="disclaimer">
              {parse(disclaimer)}
            </div>
        </div>}

        {state.error && (
          <Result
            status="warning"
            title={t("giftery.modal.error")}
            subTitle={t("giftery.modal.errorMessage")}
          />
        )}

        {state.success && (
          <Result
            status="success"
            title={t("giftery.modal.success")}
            extra={
              <Button
                type="primary"
                onClick={() => getPDF(state.order!)}
              >
                {t("giftery.modal.successBtn")}
              </Button>
            }
          />
        )}
      </>
    </Modal>
  );
});

export default Giftery;
