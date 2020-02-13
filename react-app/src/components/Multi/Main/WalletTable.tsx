import {
  Table,
  Tag,
  Icon,
  message,
  Popover,
  Button,
  Alert,
  Modal,
  Popconfirm,
  Input,
  Switch,
  InputNumber,
  Select
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MultiStoreContext } from "../../../stores/multiStore";
import copy from "copy-to-clipboard";
import config from "../../../config";

import * as Share from "react-share";
import Column from "antd/lib/table/Column";
import {
  deleteWalletFromCampaign,
  editWallet
} from "../../../services/campaignApi";
import qrlogo from "../../../assets/qr.png";
import Search from "antd/lib/input/Search";
import { sendEmail } from "../../../services/walletApi";
var QRCodeCanvas = require("qrcode.react");

const statusColor = (status: string) => {
  switch (status) {
    case "created":
      return "blue";
    case "opened":
      return "purple";
    case "touched":
      return "green";
    default:
      return "";
  }
};

const copyLink = (link: string) => {
  copy(`${config.domain}${link}`);
  message.success("Link copied");
};

const WalletTable: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    share: false,
    link: "",
    edit: false,
    editName: "",
    editEmail: "",
    editCoin: "",
    editAmount: 0,
    editStatus: "created",
    editLoading: false,
    mailLoading: false,
    email: "",
    showAddress: true,
    showBrowser: false,
    showRedeem: true,
    showLastVisit: true,
    showName: false,
    showEmail: false,
    showCoin: true,
    showAmount: true,
    hideSwitches: true
  });

  const saveEditWallet = async () => {
    try {
      setState({ ...state, editLoading: true });
      await editWallet(
        mStore.link!,
        mStore.password!,
        state.link,
        state.editCoin,
        state.editAmount,
        state.editStatus,
        state.editName,
        state.editEmail
      );
      message.success("Wallet saved");
      mStore.getWalletsData();
    } catch (error) {
      message.error("Error while saving wallet settings");
    }
    setState({ ...state, editLoading: false, edit: false });
  };

  const sendMail = async () => {
    try {
      let r = await sendEmail(state.email, state.link, mStore.fromName);
      message.success(`Push sent to ${state.email}`);
      setState({ ...state, email: "" });
    } catch (error) {
      message.error(`Email sending error`);
    }
  };

  const deleteWallet = async (item: string) => {
    try {
      let res = await deleteWalletFromCampaign(
        mStore.link!,
        mStore.password!,
        item
      );
      message.success(`Wallet ${item} deleted`);
      mStore.getWalletsData();
    } catch (error) {
      message.error("Error whle deleting wallet");
    }
  };

  const { Option } = Select;

  const mailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return (
    <>
      {state.hideSwitches ? <div className="table-switches">
        <div className="item">
          <p style={{marginRight: '5px'}}>Show Table Settings</p>
          <Switch
              size="small"
              checked={!state.hideSwitches}
              onChange={val => setState({ ...state, hideSwitches: !val })}
          />
        </div>
      </div> :
      <div className="table-switches">
        <div className="item">
          <p>Address</p>
          <Switch
            size="small"
            checked={state.showAddress}
            onChange={val => setState({ ...state, showAddress: val })}
          />
        </div>
        <div className="item">
          <p>Redeem</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showRedeem: val })}
            checked={state.showRedeem}
          />
        </div>
        <div className="item">
          <p>Last Visit</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showLastVisit: val })}
            checked={state.showLastVisit}
          />
        </div>
        <div className="item">
          <p>Browser Info</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showBrowser: val })}
            checked={state.showBrowser}
          />
        </div>
        <div className="item">
          <p>Name</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showName: val })}
            checked={state.showName}
          />
        </div>
        <div className="item">
          <p>Email</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showEmail: val })}
            checked={state.showEmail}
          />
        </div>
        <div className="item">
          <p>Coin</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showCoin: val })}
            checked={state.showCoin}
          />
        </div>
        <div className="item">
          <p>Amount</p>
          <Switch
            size="small"
            onChange={val => setState({ ...state, showAmount: val })}
            checked={state.showAmount}
          />
        </div>
        <div className="item">
          <Button
            shape="round"
            type="primary"
            onClick={() => mStore.getWalletsData()}
          >
            Refresh
          </Button>
        </div>
      </div>}
      <div className="wallet-table">
        <Table
          size="small"
          bordered
          pagination={
            mStore.walletsData.length < 50
              ? false
              : { position: "bottom", pageSize: 50 }
          }
          dataSource={mStore.walletsData}
          rowKey="link"
          scroll={{ x: 1150 }}
          loading={mStore.isLoadingWalletsData}
        >
          <Column
            title="Link"
            dataIndex="link"
            key="link"
            width={120}
            render={text => (
              <a onClick={() => copyLink(text as string)}>
                {text} <Icon type="copy" />
              </a>
            )}
          />
          {state.showAddress && (
            <Column
              title="Address"
              dataIndex="address"
              key="address"
              ellipsis
            />
          )}
          <Column
            title="Status"
            dataIndex="status"
            key="status"
            render={(tag: string) => (
              <Tag key={tag} color={statusColor(tag)}>
                {tag.toUpperCase()}
              </Tag>
            )}
          />
          {state.showRedeem && (
            <Column
              title="Redeem"
              dataIndex="redeem"
              key="redeem"
              render={(tag: any) => {
                if (tag && tag.result) {
                  return (
                    <Popover
                      content="Средства успешно зачислены"
                      trigger="hover"
                    >
                      <Tag key={tag} color="green">
                        <a
                          href={`https://minterscan.net/tx/${tag.result}`}
                          target="_blank"
                        >
                          {tag.value} {tag.coin}
                        </a>
                      </Tag>
                    </Popover>
                  );
                } else if (tag) {
                  return (
                    <Popover
                      content="Средства не были зачислены. Возможно, нужного баланса не было на основном кошельке."
                      trigger="hover"
                    >
                      <Tag key={tag} color="red">
                        {tag.value} {tag.coin}
                      </Tag>
                    </Popover>
                  );
                }
              }}
            />
          )}
          {state.showName && (
            <Column title="Name" dataIndex="name" key="name" ellipsis />
          )}
          {state.showEmail && (
            <Column title="Email" dataIndex="email" key="email" ellipsis />
          )}
          {state.showCoin && (
            <Column
              title="Coin"
              dataIndex="coin"
              key="coin"
              render={item => {
                if (!item) {
                  return mStore.coin;
                } else {
                  return item;
                }
              }}
            />
          )}
          {state.showAmount && (
            <Column
              title="Amount"
              dataIndex="amount"
              key="amount"
              render={item => {
                if (!item) {
                  return mStore.value;
                } else {
                  return item;
                }
              }}
            />
          )}
          {state.showBrowser && (
            <Column
              title="Client"
              dataIndex="browser"
              key="browser"
              ellipsis
              render={(item: any) => {
                if (item) {
                  return (
                    <span>
                      {item.os}, {item.name}, {item.version}
                    </span>
                  );
                }
              }}
            />
          )}
          {state.showLastVisit && (
            <Column
              title="Last Visit"
              dataIndex="lastVisit"
              key="lastVisit"
              ellipsis
              render={(item: any) => {
                if (item) {
                  return <span>{new Date(item).toLocaleString()}</span>;
                }
              }}
            />
          )}
          <Column
            title="Actions"
            dataIndex="link"
            key="actions"
            render={(item: any) => {
              if (item) {
                return (
                  <>
                    <Button
                      size="small"
                      icon="notification"
                      onClick={() => {
                        let wallet = mStore.walletsData.find(
                          x => x.link === item
                        );
                        setState({ ...state, share: true, link: item, email: wallet.email });
                      }}
                    />
                    <Button
                      size="small"
                      icon="edit"
                      style={{ marginLeft: "7px" }}
                      onClick={() => {
                        let wallet = mStore.walletsData.find(
                          x => x.link === item
                        );
                        setState({
                          ...state,
                          edit: true,
                          link: item,
                          editCoin: wallet.coin ? wallet.coin : mStore.coin,
                          editAmount: wallet.amount
                            ? wallet.amount
                            : mStore.value,
                          editStatus: wallet.status,
                          editName: wallet.name,
                          editEmail: wallet.email
                        });
                      }}
                    />
                    <Popconfirm
                      title="Вы уверены, что хотите удалить этот кошелек?"
                      onConfirm={() => deleteWallet(item)}
                      okText="Удалить"
                      cancelText="Отмена"
                    >
                      <Button
                        size="small"
                        icon="delete"
                        style={{ marginLeft: "7px" }}
                      />
                    </Popconfirm>
                  </>
                );
              }
            }}
          />
        </Table>

        <Modal
          wrapClassName="share-modal"
          visible={state.share}
          maskClosable
          onCancel={() =>
            setState({ ...state, share: false, link: "", email: "" })
          }
          footer={
            <Button
              key="back"
              onClick={() =>
                setState({ ...state, share: false, link: "", email: "" })
              }
            >
              Закрыть
            </Button>
          }
        >
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
            <div className="email">
              {/* <p>Отправить на E-Mail</p> */}
              <Input
                placeholder="Email..."
                value={state.email}
                onChange={e => setState({ ...state, email: e.target.value })}
              />
              <Button
                type="primary"
                onClick={sendMail}
                loading={state.mailLoading}
                disabled={!mailRegExp.test(state.email)}
              >
                Send
              </Button>
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
        </Modal>

        <Modal
          wrapClassName="edit-modal"
          visible={state.edit}
          maskClosable
          title="Edit wallet"
          onCancel={() => setState({ ...state, edit: false, link: "" })}
          footer={
            <>
              <Button
                key="back"
                onClick={() => setState({ ...state, edit: false, link: "" })}
              >
                Закрыть
              </Button>
              <Button
                key="save"
                type="primary"
                onClick={saveEditWallet}
                loading={state.editLoading}
              >
                Сохранить
              </Button>
            </>
          }
        >
          <div className="edit-wallet">
            <div className="send-form">
              <div className="field">
                <label>Status</label>
                <Select
                  value={state.editStatus}
                  onChange={(val: string) =>
                    setState({ ...state, editStatus: val })
                  }
                >
                  <Option key={1} value="created">
                    Created
                  </Option>
                  <Option key={2} value="opened">
                    Opened
                  </Option>
                  <Option key={3} value="touched">
                    Touched
                  </Option>
                </Select>
              </div>
              <div className="coin-val">
                <div className="coin">
                  <label>{t("anotherWallet.coin")}</label>
                  <Input
                    value={state.editCoin}
                    placeholder="BIP"
                    maxLength={10}
                    onChange={e =>
                      setState({
                        ...state,
                        editCoin: e.target.value.toUpperCase()
                      })
                    }
                  />
                </div>
                <div className="amount">
                  <label>{t("anotherWallet.value")}</label>
                  <InputNumber
                    min={0}
                    value={state.editAmount}
                    autoFocus
                    onChange={val => setState({ ...state, editAmount: val! })}
                  />
                </div>
              </div>
              <div className="field">
                <label>{t("sendForm.recipient")}</label>
                <Input
                  placeholder="Alice"
                  value={state.editName}
                  onChange={e =>
                    setState({ ...state, editName: e.target.value })
                  }
                  maxLength={30}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <Input
                  placeholder="mail@hotmail.com"
                  value={state.editEmail}
                  onChange={e =>
                    setState({ ...state, editEmail: e.target.value })
                  }
                  maxLength={45}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
});

export default WalletTable;
