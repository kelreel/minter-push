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
  Switch
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MultiStoreContext } from "../../../stores/multiStore";
import copy from "copy-to-clipboard";
import config from "../../../config";

import * as Share from "react-share";
import Column from "antd/lib/table/Column";
import { deleteWalletFromCampaign } from "../../../services/campaignApi";
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
    mailLoading: false,
    email: "",
    showAddress: true,
    showBrowser: false,
    showRedeem: true,
    showLastVisit: true
  });

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

  const mailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return (
    <>
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
      </div>
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
          scroll={{ x: 1000 }}
        >
          <Column
            title="Link"
            dataIndex="link"
            key="link"
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
          {state.showRedeem && <Column
            title="Redeem"
            dataIndex="redeem"
            key="redeem"
            render={(tag: any) => {
              if (tag && tag.result) {
                return (
                  <Popover content="Средства успешно зачислены" trigger="hover">
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
          />}
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
          {state.showLastVisit && <Column
            title="Last Visit"
            dataIndex="lastVisit"
            key="lastVisit"
            ellipsis
            render={(item: any) => {
              if (item) {
                return <span>{new Date(item).toLocaleString()}</span>;
              }
            }}
          />}
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
                      onClick={() =>
                        setState({ ...state, share: true, link: item })
                      }
                    />
                    <Popover
                      content="Редактирование. Будет доступно в обновлениях."
                      trigger="hover"
                    >
                      <Button
                        disabled
                        size="small"
                        icon="edit"
                        style={{ marginLeft: "7px" }}
                      />
                    </Popover>
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
          onCancel={() => setState({ ...state, edit: false, link: "" })}
          footer={
            <Button
              key="back"
              onClick={() => setState({ ...state, edit: false, link: "" })}
            >
              Закрыть
            </Button>
          }
        >
          <div className="share">
            <QRCodeCanvas
              value={`${config.domain}${state.link}`}
              onClick={copyLink}
              size={200}
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
        </Modal>
      </div>
    </>
  );
});

export default WalletTable;
