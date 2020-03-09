import "./HomeView.scss";

import {Button, Card, Layout} from "antd";
import Title from "antd/lib/typography/Title";
import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";

import SendForm from "../../components/SendForm/SendForm";
import {AppStoreContext} from "../../stores/appStore";
import history from "../../stores/history";

const {Content} = Layout;

const Home: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const {t, i18n} = useTranslation();

  const created = (
    link: string
  ) => {
    history.push(`/create/${link}`)
  };

  return (
    <Content className="home-view">
      <Title level={3} style={{marginBottom: "35px"}} className="animated bounceInRight">
        {t("home.title")}
      </Title>
      <Card className="send-card-home animated bounceInLeft">
        <SendForm created={created}/>
      </Card>
      <Button className="multi-btn animated bounceInUp" onClick={() => history.push("/multi")}>
        {t('multibtn')}
      </Button>
    </Content>
  );
});

export default Home;
