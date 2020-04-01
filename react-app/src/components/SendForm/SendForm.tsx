import "./SendForm.scss";

import { Button, Icon, Input, message, Switch, Upload } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { UploadChangeParam } from "antd/lib/upload";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { newWallet } from "../../services/createWaleltApi";
import { addToHistory, historyEntryType } from "../../services/walletsHistory";

const SendForm: React.FC<{ created: Function }> = ({ created }) => {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    from: "",
    to: "",
    message: "",
    password: "",
    loading: false,
    showName: false,
    showFrom: false,
    showPassword: false,
    showPayload: false,
    showPreset: false,
    preset: null
  });

  const importJSON = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === "error" || info.file.status === "done") {
      try {
        let reader = new FileReader();
        //@ts-ignore
        reader.readAsText(info.file.originFileObj, "utf8");
        reader.onload = () => {
          let preset = JSON.parse(reader.result as string);
          setState({ ...state, preset: preset });
          message.success("Preset imported");
        };
      } catch (error) {
        message.error("Import error");
      }
    }
  };

  const { TextArea } = Input;

  const send = async () => {
    setState({ ...state, loading: true });
    try {
      let res = await newWallet(
        state.password,
        state.to,
        state.message,
        state.from,
        state.preset
      );
      addToHistory(
        historyEntryType.push,
        res.data.address,
        res.data.link,
        res.data.seed,
        res.data.password
      );
      setTimeout(() => created(res.data.link), 500);
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
        <div className="switch">
          <label>{t("sendForm.recipient")}</label>
          {!state.showName && (
            <Switch
              size="small"
              onChange={val => setState({ ...state, showName: val })}
            />
          )}
        </div>

        {state.showName && (
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            maxLength={40}
            autoFocus
            placeholder={t("sendForm.toPlaceholder")}
            onChange={e => setState({ ...state, to: e.target.value })}
          />
        )}
      </div>
      <div className="field">
        <div className="switch">
          <label>{t("sendForm.sender")}</label>
          {!state.showFrom && (
            <Switch
              size="small"
              onChange={val => setState({ ...state, showFrom: val })}
            />
          )}
        </div>

        {state.showFrom && (
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            maxLength={40}
            autoFocus
            placeholder={t("sendForm.fromPlaceholder")}
            onChange={e => setState({ ...state, from: e.target.value })}
          />
        )}
      </div>
      <div className="field">
        <div className="switch">
          <label>{t("sendForm.password")}</label>
          {!state.showPassword && (
            <Switch
              size="small"
              onChange={val => setState({ ...state, showPassword: val })}
            />
          )}
        </div>

        {state.showPassword && (
          <Input.Password
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            maxLength={30}
            autoFocus
            placeholder="Password"
            onChange={e => setState({ ...state, password: e.target.value })}
          />
        )}
      </div>
      <div className="field">
        <div className="switch">
          <label>{t("sendForm.message")}</label>
          {!state.showPayload && (
            <Switch
              size="small"
              onChange={val => setState({ ...state, showPayload: val })}
            />
          )}
        </div>

        {state.showPayload && (
          <TextArea
            rows={2}
            maxLength={1200}
            autoFocus
            placeholder={t("sendForm.payloadPlaceholder")}
            onChange={e => setState({ ...state, message: e.target.value })}
          />
        )}
      </div>
      <div className="field">
        <div className="switch">
          <label>{t("sendForm.preset")}</label>
          {!state.showPreset && (
            <Switch
              size="small"
              onChange={val => setState({ ...state, showPreset: val })}
            />
          )}
        </div>

        {state.showPreset && (
          <div className="preset">
            <Upload accept={".json"} onChange={importJSON} multiple={false}>
              <Button
                icon="upload"
                size="small"
                style={{ marginRight: "10px" }}
              >
                {t("editor.import")}
              </Button>
            </Upload>
            <a href="/preset" target={"_blank"}>
              Editor
            </a>
          </div>
        )}
      </div>
      <Button
        className="action-btn animated infinite pulse slow delay-3s"
        loading={state.loading}
        onClick={send}
        type="primary"
        size="large"
      >
        {t("sendForm.send")}
      </Button>
    </div>
  );
};

export default SendForm;
