import { Button, Input, message, Popconfirm, Tag } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { resetCampaignPreset } from "../../../services/campaignApi";
import { MultiStoreContext } from "../../../stores/multiStore";
import { PresetStoreContext } from "../../../stores/presetStore";

const PresetSettings: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const pStore = useContext(PresetStoreContext);
  const { t, i18n } = useTranslation();
  const { TextArea } = Input;

  const reset = async () => {
    try {
      await resetCampaignPreset(mStore.link!, mStore.password!);
      await mStore.initCampaign(mStore.link!, mStore.password!);
      message.success(t("Reset success"));
    } catch (error) {
      message.error("Error while reset preset");
    }
  };

  return (
    <div className="preset-content">
      <div className="row">
        <h3>{t("multi.preset")}</h3>
        {mStore.preset ? (
          <Tag color="green">Custom</Tag>
        ) : (
          <Tag color="blue">Default</Tag>
        )}
      </div>

      <p>{t("multi.presetContent")}</p>

      <div className="actions">
        <Popconfirm
          title="Are you sure reset preset?"
          onConfirm={reset}
          okText="Yes"
          cancelText="No"
        >
          <Button>{t("multi.reset")}</Button>
        </Popconfirm>
        <a
          href="/preset/"
          className={"ant-btn ant-btn-primary"}
          target="_blank"
        >
          {t("multi.edit")}
        </a>
      </div>
    </div>
  );
});

export default PresetSettings;
