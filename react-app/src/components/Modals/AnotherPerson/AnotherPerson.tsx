import './AnotherPerson.scss';

import { Alert, Button, Icon, Input, Modal, message } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Share from 'react-share';

import config from '../../../config';
import { repackWallet } from '../../../services/walletApi';
import { AppStoreContext } from '../../../stores/appStore';
import copy from 'copy-to-clipboard';
import qrlogo from '../../../assets/qr.png'

var QRCodeCanvas = require("qrcode.react");

const copyLink = (link: string) => {
  copy(`${config.domain}${link}`);
  message.success("Link copied");
};

const AnotherPerson: React.FC<{ visible: boolean }> = observer(
  ({ visible }) => {
    const store = useContext(AppStoreContext);
    const [state, setState] = useState({
      visible,
      loading: false,
      name: "",
      link: ""
    });

    useEffect(() => {
      setState({ ...state, visible });
    }, [visible]);

    const { t, i18n } = useTranslation();

    const handleOk = async () => {
      setState({ ...state, loading: true });
      let res = await repackWallet(store.seed!, state.name);
      setState({ ...state, loading: false, link: res.data.link });
    };

    const handleCancel = () => {
      setState({ ...state, visible: false });
    };

    return (
      <Modal
        wrapClassName="another-person"
        maskClosable={false}
        visible={state.visible}
        title={t("anotherPerson.title")}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("anotherPerson.cancel")}
          </Button>,
          <>
            {state.link.length === 0 && (
              <Button
                key="submit"
                type="primary"
                loading={state.loading}
                onClick={handleOk}
              >
                {t("anotherPerson.send")}
              </Button>
            )}
          </>
        ]}
      >
        {!state.link ? (
          <>
            <Alert
              type="success"
              style={{ marginBottom: "20px" }}
              message={t("anotherPerson.content1")}
            />
            <div className="send-form">
              <div className="field">
                <label>{t("sendForm.recipient")}</label>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  size="large"
                  maxLength={40}
                  placeholder={t("sendForm.toPlaceholder")}
                  onChange={e => setState({ ...state, name: e.target.value })}
                />
              </div> 
            </div>
          </>
        ) : (
          <div className="share">
            <QRCodeCanvas
              value={`${config.domain}${state.link}`}
              onClick={copyLink}
              size={220}
              includeMargin={true}
              imageSettings={{
                src: qrlogo,
                height: 23,
                width: 150,
                y: 170,
                excavate: true
              }}
            />
            <p className="click-copy">Click link to copy</p>
            <div onClick={() => copyLink(state.link)} className="link">
              <Alert message={`${config.domain}${state.link}`} type="success" />
            </div>
            <div className="share-buttons">
              <Share.VKShareButton url={`${config.domain}${state.link}`}>
                <Share.VKIcon size={32} round={true} />
              </Share.VKShareButton>
              <Share.TelegramShareButton url={`${config.domain}${state.link}`}>
                <Share.TelegramIcon size={32} round={true} />
              </Share.TelegramShareButton>
              <Share.ViberShareButton url={`${config.domain}${state.link}`}>
                <Share.ViberIcon size={32} round={true} />
              </Share.ViberShareButton>
              <Share.WhatsappShareButton url={`${config.domain}${state.link}`}>
                <Share.WhatsappIcon size={32} round={true} />
              </Share.WhatsappShareButton>
              <Share.EmailShareButton url={`${config.domain}${state.link}`}>
                <Share.EmailIcon size={32} round={true} />
              </Share.EmailShareButton>
            </div>
          </div>
        )}
      </Modal>
    );
  }
);

export default AnotherPerson;
