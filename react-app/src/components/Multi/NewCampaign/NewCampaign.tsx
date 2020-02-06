import "./SendForm.scss";

import { Button, Icon, Input, InputNumber, message } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { newCampaign } from "../../../services/campaignApi";
import history from "../../../stores/history";
import { MultiStoreContext } from "../../../stores/multiStore";
import {
  addToHistory,
  historyEntryType
} from "../../../services/walletsHistory";

const NewMultiForm: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    name: "",
    password: "",
    number: 10,
    loading: false
  });

  const send = async () => {
    setState({ ...state, loading: true });
    try {
      let res = await newCampaign(state.password, state.name, state.number);
      //created(res.data.address, res.data.seed, res.data.link, state.password);
      window.localStorage.setItem("mpass", state.password);
      window.localStorage.setItem("mlink", res.data.link);
      history.push(`/multi/${res.data.link}`);
      addToHistory(
        historyEntryType.multi,
        undefined,
        res.data.link,
        undefined,
        state.password
      );
      console.log(res.data);
    } catch (error) {
      message.warning(error.message);
      console.log(error);
    }
    setState({ ...state, loading: false });
  };

  return (
    <div className="send-form">
      <div className="field">
        {/* <label>{t("sendForm.recipient")}</label> */}
        <label>Название рассылки</label>
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          maxLength={40}
          placeholder="Кэшбэк за январь"
          onChange={e => setState({ ...state, name: e.target.value })}
        />
      </div>
      <div className="field">
        <label>{t("sendForm.password")}</label>
        <Input.Password
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          maxLength={30}
          placeholder="Password"
          onChange={e => setState({ ...state, password: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Количество получателей</label>
        <InputNumber
          min={1}
          max={50}
          value={state.number}
          onChange={val => setState({ ...state, number: val! })}
        />
      </div>
      <Button
        loading={state.loading}
        onClick={send}
        type="primary"
        size="large"
        disabled={state.password.length < 4 || state.name.length < 3}
      >
        {t("sendForm.send")}
      </Button>
    </div>
  );
});

export default NewMultiForm;
