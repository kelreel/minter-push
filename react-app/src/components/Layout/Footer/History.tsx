import { Button, Collapse, Layout, message } from "antd";
import copy from "copy-to-clipboard";
import React from "react";

import config from "../../../config";
import {
  getWalletsHistory,
  historyEntryType
} from "../../../services/walletsHistory";

const copyLink = (link: string) => {
  copy(link);
  message.success("Link copied");
};

const History: React.FC = () => {
  const { Footer } = Layout;
  const { Panel } = Collapse;

  if (getWalletsHistory()) {
    return (
      <Collapse className="history" accordion>
        {getWalletsHistory()?.map(item => (
          <Panel
            header={
              item.type == historyEntryType.multi
                ? `Campaign: ${item.link} (${new Date(
                    item.date
                  ).toLocaleDateString()})`
                : `${item.link} (${new Date(item.date).toLocaleDateString()})`
            }
            key={item.date}
          >
            {item.address && (
              <p>
                <strong>Address: </strong>
                {item.address}
              </p>
            )}
            <p></p>
            {item.seed && (
              <p>
                <strong>Seed: </strong>
                {item.seed}
              </p>
            )}
            {item.type === historyEntryType.multi && (
              <p>
                <a href={`${config.domain}multi/${item.link}`} target="_blank">
                  Open Link
                </a>
              </p>
            )}
            {item.password && (
              <p>
                <strong>Password: </strong>
                {item.password}
              </p>
            )}
            {item.type === historyEntryType.push && (
              <div className="actions">
                <Button
                  onClick={() => copyLink(`${config.domain}${item.link}`)}
                >
                  Copy link
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `${config.domain}create/${item.link}`,
                      "_blank"
                    );
                  }}
                >
                  Refill
                </Button>
              </div>
            )}
          </Panel>
        ))}
      </Collapse>
    );
  } else return <p>Вы еще не отправляли переводов с этого устройства.</p>;
};

export default History;
