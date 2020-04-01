import { Button, Input, message, Modal } from "antd";
import copy from "copy-to-clipboard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getBitcoinAddressToRefill } from "../../services/walletApi";
import { mailRegExp } from "../Modals/Giftery/Giftery";

var QRCodeCanvas = require("qrcode.react");

export const BitcoinModal: React.FC<{ visible: boolean; address: string }> = ({
  visible,
  address
}) => {
  const [state, setState] = useState({
    visible,
    loading: false,
    bitcoinAddress: "",
    email: "",
    success: false
  });
  const copyAddress = () => {
    copy(state.bitcoinAddress);
    message.success(t("walletCreated.copyAddressSuccess"));
  };

  const handleOk = async () => {
    setState({ ...state, loading: true });
    try {
      let res = await getBitcoinAddressToRefill(state.email, address);
      setState({
        ...state,
        success: true,
        bitcoinAddress: res.data.data.address,
        loading: false
      });
    } catch (error) {
      message.error("Error while getting BTC address");
      setState({ ...state, loading: false });
    }
  };

  const handleCancel = () => {
    setState({ ...state, visible: false });
  };

  const { t, i18n } = useTranslation();

  useEffect(() => {
    setState({ ...state, visible, success: false });
  }, [visible]);

  return (
    <Modal
      visible={state.visible}
      onCancel={handleCancel}
      title="Bitcoin Refill"
      footer={
        <>
          {!state.success && (
            <>
              <Button key="back" onClick={handleCancel}>
                {t("giftery.modal.cancel")}
              </Button>
              <Button
                disabled={!mailRegExp.test(state.email)}
                key="submit"
                type="primary"
                loading={state.loading}
                onClick={handleOk}
              >
                {t("giftery.modal.next")}
              </Button>
            </>
          )}
          {state.success && (
            <Button key="back" onClick={handleCancel}>
              {t("giftery.modal.cancel")}
            </Button>
          )}
        </>
      }
    >
      {state.success ? (
        <div className="bitcoin-refill-success">
          <p style={{ textAlign: "center" }}>
            Bitcoin will be converted to BIP after 2 confirmations
          </p>
          <div className="address">
            <p onClick={copyAddress} style={{ cursor: "pointer" }}>
              {state.bitcoinAddress}
            </p>
          </div>
          <QRCodeCanvas value={address} onClick={copyAddress} size={200} />
        </div>
      ) : (
        <div className="bitcoin-refill">
          <div className="field">
            <label>E-Mail</label>
            <Input
              autoFocus
              onPressEnter={handleOk}
              placeholder="hello@mail.com"
              value={state.email}
              onChange={e => {
                setState({ ...state, email: e.target.value });
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BitcoinModal;
