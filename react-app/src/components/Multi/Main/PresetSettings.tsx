import React, {useContext} from "react";
import {observer} from "mobx-react-lite";
import {MultiStoreContext} from "../../../stores/multiStore";
import {useTranslation} from "react-i18next";
import copy from "copy-to-clipboard";
import {message, Button, Input, Tag, Popconfirm} from "antd";
import {PresetStoreContext} from "../../../stores/presetStore";
import {resetCampaignPreset} from "../../../services/campaignApi";

const PresetSettings: React.FC = observer(() => {
    const mStore = useContext(MultiStoreContext);
    const pStore = useContext(PresetStoreContext)
    const {t, i18n} = useTranslation();
    const {TextArea} = Input;

    const reset = async () => {
        try {
            await resetCampaignPreset(mStore.link!, mStore.password!)
            await mStore.initCampaign(mStore.link!, mStore.password!)
            message.success(t("Reset success"));
        } catch (error) {
            message.error('Error while reset preset')
        }
    };

    return (
        <div className="preset-content">
            <div className="row">
                <h3>Preset</h3>
                {mStore.preset ? <Tag color="green">Custom</Tag> : <Tag color="blue">Default</Tag>}
            </div>

            <div className="actions">
                <Popconfirm
                    title="Are you sure reset preset?"
                    onConfirm={reset}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button>Reset</Button>
                </Popconfirm>
                <a href="/preset/" className={"ant-btn ant-btn-primary"} target="_blank">Edit</a>
            </div>
        </div>
    );
});

export default PresetSettings;
