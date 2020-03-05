import './NewMulti.scss';

import { Button, Card, Layout } from 'antd';
import Title from 'antd/lib/typography/Title';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NewMultiForm from '../../components/Multi/NewCampaign/NewCampaign';
import history from '../../stores/history';

import Particles from "react-particles-js";

const { Content } = Layout;

const NewMultiView: React.FC = observer(() => {
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    created: false,
    name: "",
    password: "",
    number: 10
  });

  return (
    <Content className="new-multi-view">
      <Title level={3} style={{ marginBottom: "20px" }}>
        {t("newCampaign.title")}
      </Title>
      <Card>
        <NewMultiForm />
      </Card>
      <Button className="multi-btn" onClick={() => history.push("/")}>
        {t("singlebtn")}
      </Button>
    </Content>
  );
})

export default NewMultiView;
