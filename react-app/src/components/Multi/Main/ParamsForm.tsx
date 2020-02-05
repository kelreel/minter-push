import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { MultiStoreContext } from "../../../stores/multiStore";
import { Card, message, Button, Input, Icon, InputNumber } from "antd";
import { shortAddress } from "../../../services/utils";
import copy from "copy-to-clipboard";

const ParamsForm: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false)

  const save = async () => {
    setLoading(true);
    try {
      await mStore.setCampaign()
      message.success('Settings saved')
    } catch (error) {
      console.log(error);
      message.error('Error while saving settings')
    }
    setLoading(false)
  };

  return (
    <div className="params-form">
      <h3>Settings</h3>
      <p>Общие параметры для всех получателей</p>
      <div className="field">
        <label>{t("sendForm.sender")}</label>
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          maxLength={40}
          value={mStore.fromName!}
          placeholder="NUT.mn"
          onChange={e => mStore.fromName = e.target.value}
        />
      </div>
      <div className="field">
        <label>{t("sendForm.message")}</label>
        <Input
          maxLength={120}
          value={mStore.payload!}
          placeholder="Cashback for fuel (January)"
          onChange={e => mStore.payload = e.target.value}
        />
      </div>
      <div className="coin-val">
        <div className="coin">
          <label>Монета</label>
          <Input
            value={mStore.coin!}
            maxLength={10}
            placeholder="BIP"
            onChange={e => mStore.coin = e.target.value.toUpperCase() }
          />
        </div>
        <div className="amount">
          <label>Количество</label>
          <InputNumber
            min={0.1}
            max={999999999}
            value={mStore.value!}
            onChange={val => mStore.value = val!}
          />
        </div>
      </div>
      <div className="actions">
        <Button loading={loading} onClick={save} type="primary">
          Сохранить
        </Button>
      </div>
    </div>
  );
});

export default ParamsForm;
