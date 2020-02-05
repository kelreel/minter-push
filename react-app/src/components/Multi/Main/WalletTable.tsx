import { Table, Tag, Icon, message } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MultiStoreContext } from "../../../stores/multiStore";
import copy from "copy-to-clipboard";
import config from "../../../config";

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
  message.success('Link copied');
};

const columns = [
  {
    title: "Link",
    dataIndex: "link",
    key: "link",
    render: (text: React.ReactNode) => (
      <a onClick={() => copyLink(text as string)}>
        {text} <Icon type="copy" />
      </a>
    )
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    ellipsis: true
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (tag: string) => (
      <Tag key={tag} color={statusColor(tag)}>
        {tag.toUpperCase()}
      </Tag>
    )
  }
];

const WalletTable: React.FC = observer(() => {
  const mStore = useContext(MultiStoreContext);
  const { t, i18n } = useTranslation();

  return (
    <div className="wallet-table">
      <Table
        size="small"
        bordered
        pagination={false}
        columns={columns}
        dataSource={mStore.walletsData}
        rowKey="link"
      />
    </div>
  );
});

export default WalletTable;
