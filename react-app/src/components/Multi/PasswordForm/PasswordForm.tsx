import "./PasswordForm.scss";

import { Button, Card, Input, message } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCampaign } from "../../../services/campaignApi";
import { MultiStoreContext } from "../../../stores/multiStore";

const MultiPasswordForm: React.FC<{ link: string }> = observer(({ link }) => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    password: "",
    loading: false
  });

  const login = async () => {
    setState({ ...state, loading: true });
    try {
      let res = await getCampaign(link, state.password);
      await mStore.initCampaign(link, state.password);
    } catch (error) {
      const { response } = error;
      response ? message.error(response.data.message) : message.error(error);
    }
    setState({ ...state, loading: false });
  };

  return (
    <div className="wallet-password animated fadeIn">
      <Card title="Protected">
        <Input.Password
          onPressEnter={login}
          onChange={e => setState({ ...state, password: e.target.value })}
          placeholder="Password..."
        />
        <div className="actions">
          <Button
            onClick={login}
            loading={state.loading}
            disabled={state.password.length === 0}
            type="primary"
          >
            {t("password.loginBtn")}
          </Button>
        </div>
      </Card>
    </div>
  );
});

export default MultiPasswordForm;
