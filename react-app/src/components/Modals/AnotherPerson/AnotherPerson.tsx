import './AnotherPerson.scss';

import { Button, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppStoreContext } from '../../../stores/appStore';

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
        <p>{t("anotherPerson.content1")}</p>
        <p>{t("anotherPerson.content2")}</p>
      </Modal>
    );
  }
);

export default AnotherPerson;
