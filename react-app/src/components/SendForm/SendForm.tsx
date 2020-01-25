import React, { useState } from "react";
import { Input, Icon, Form, Button } from "antd";
import "./SendForm.scss";
import { useTranslation } from "react-i18next";
import { newWallet } from "../../services/createWaleltApi";

const SendForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    from: "",
    to: "",
    message: "",
    password: "",
    loading: false
  });

  const { TextArea } = Input;

  const send = async () => {
    setState({...state, loading: true})
    let res = await newWallet(state.password, state.to, state.message, state.from)
    setState({ ...state, loading: false });
    console.log(res.data);
  };

  return (
    <div className="send-form">
      <div className="field">
        <label>{t("sendForm.recipient")}</label>
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          size="large"
          maxLength={40}
          placeholder={t("sendForm.toPlaceholder")}
          onChange={e => setState({ ...state, to: e.target.value })}
        />
      </div>
      <div className="field">
        <label>{t("sendForm.sender")}</label>
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          size="large"
          maxLength={40}
          placeholder={t("sendForm.fromPlaceholder")}
          onChange={e => setState({ ...state, from: e.target.value })}
        />
      </div>
      <div className="field">
        <label>{t("sendForm.password")}</label>
        <Input.Password
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          size="large"
          maxLength={30}
          placeholder="Password"
          onChange={e => setState({ ...state, password: e.target.value })}
        />
      </div>
      <div className="field">
        <label>{t("sendForm.message")}</label>
        <TextArea
          rows={3}
          maxLength={1200}
          placeholder={t("sendForm.payloadPlaceholder")}
          onChange={e => setState({ ...state, message: e.target.value })}
        />
      </div>
      <Button loading={state.loading} onClick={send} type="primary" size="large">
        {t("sendForm.send")}
      </Button>
    </div>
  );
};

export default SendForm;
