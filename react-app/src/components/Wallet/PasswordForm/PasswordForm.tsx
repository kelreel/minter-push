import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../../stores/appStore";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { getWallet, getSeed } from "../../../services/walletApi";
import { Input, Card, Button, message } from "antd";
import './PasswordForm.scss'

const PasswordForm: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    password: '',
    loading: false
  })

  const login = async () => {
    setState({...state, loading: true})
    try {
      let res = await getSeed(state.password, store.link!)
      store.setSeed(res.data.seed)
    } catch (error) {
      const { response } = error;
      response ? message.error(response.data) : message.error(error);
    }
    setState({ ...state, loading: false });
  }

  return (
    <div className="wallet-password">
      <Card title={t("password.title")}>
        <Input.Password onPressEnter={login} onChange={(e) => setState({...state, password: e.target.value})} placeholder="Password..." />
        <div className="actions">
          <Button onClick={login} loading={state.loading} disabled={state.password.length === 0} type='primary'>{t('password.loginBtn')}</Button>
        </div>
      </Card>
    </div>
  );
});

export default PasswordForm