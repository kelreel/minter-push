import "./TgView.scss";

import { Layout } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import TelegramLoginButton from "react-telegram-login";

const { Content } = Layout;

const TgView: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const { link } = useParams();

  const [state, setState] = useState({
    password: false,
    isLoading: true
  });

  useEffect(() => {
    const init = async () => {
      setState({ ...state, isLoading: true });
    };
    init();
  }, []);

  const handleTelegramResponse = (responce: any) => {
    console.log(responce);
  };

  return (
    <Content className="tg-view">
      <div className="link">
        <p>{link}</p>
      </div>
      <TelegramLoginButton
        dataOnauth={handleTelegramResponse}
        botName="tapmn_auth_bot"
      />
    </Content>
  );
});

export default TgView;
