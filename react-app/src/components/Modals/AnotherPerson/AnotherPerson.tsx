import './AnotherPerson.scss';

import { Button, Modal, Alert } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppStoreContext } from '../../../stores/appStore';
import SendForm from '../../SendForm/SendForm';

const AnotherPerson: React.FC<{ visible: boolean }> = observer(
  ({ visible }) => {
    const store = useContext(AppStoreContext);
    const [state, setState] = useState({
      visible,
      loading: false
    });

    useEffect(() => {
      setState({...state, visible})
    }, [visible])

    const { t, i18n } = useTranslation();

    const handleOk = () => {
      setState({ ...state, visible: false });
        let win = window.open('/', "_blank");
        win!.focus();
    };

    const handleCancel = () => {
      setState({ ...state, visible: false });
    };

    return (
      <Modal
        maskClosable={false}
        visible={state.visible}
        title={t("anotherPerson.title")}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("anotherPerson.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={state.loading}
            onClick={handleOk}
          >
            {t("anotherPerson.send")}
          </Button>
        ]}
      >
        <Alert
          type="success"
          style={{ marginBottom: "20px" }}
          message={t("anotherPerson.content1")}
        />
        <p>{t("anotherPerson.content2")}</p>
      </Modal>
    );
  }
);

export default AnotherPerson;
