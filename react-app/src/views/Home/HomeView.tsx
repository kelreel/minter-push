import './HomeView.scss';

import { Layout, Spin, Card } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { AppStoreContext } from '../../stores/appStore';
import Loading from '../../components/Layout/Loading';
import Title from 'antd/lib/typography/Title';
import SendForm from '../../components/SendForm/SendForm';

const { Content } = Layout;

const Home: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getData = async () => {
    };
  }, []);

  return (
    <Content className="home-view">
      <Card>
        <Title level={4}>{t('home.title')}</Title>
        <SendForm />
      </Card>
    </Content>
  );
});

export default Home;
