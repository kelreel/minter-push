import React from "react";
import {Button, Collapse, Icon, Layout, message, Modal} from "antd";
import {getWalletsHistory, historyEntryType} from "../../../services/walletsHistory";
import config from "../../../config";
import copy from "copy-to-clipboard";
import history from "../../../stores/history";

const copyLink = (link: string) => {
  copy(link);
  message.success('Link copied')
}

const History: React.FC = () => {
  const {Footer} = Layout;
  const {Panel} = Collapse;

  if (getWalletsHistory()) {
    return <Collapse className="history" accordion>
      {getWalletsHistory()?.map(item => (
        <Panel
          header={
            item.type == historyEntryType.multi
              ? `Campaign: ${item.link} (${new Date(
              item.date
              ).toLocaleDateString()})`
              : `${item.link} (${new Date(
              item.date
              ).toLocaleDateString()})`
          }
          key={item.date}
        >
          {item.address && (
            <p>
              <strong>Address: </strong>
              {item.address}
            </p>
          )}
          <p>
          </p>
          {item.seed && (
            <p>
              <strong>Seed: </strong>
              {item.seed}
            </p>
          )}
          {item.password && (
            <p>
              <strong>Password: </strong>
              {item.password}
            </p>
          )}
          {item.type === historyEntryType.push && <div className="actions">
            <Button onClick={() => copyLink(`${config.domain}${item.link}`)}>Copy link</Button>
            <Button onClick={() => {
              window.open(`${config.domain}create/${item.link}`,'_blank');
            }}>Refill</Button>
          </div>}
        </Panel>
      ))}
    </Collapse>}
    else return  <p>Вы еще не отправляли переводов с этого устройства.</p>
}

export default History
