import {Button, Collapse, Icon, Layout, message, Modal} from "antd";
import React, {useState} from "react";
import "./Footer.scss";
import copy from "copy-to-clipboard";
import {getWalletsHistory} from "../../../services/walletsHistory";
import config from "../../../config";
import History from "./History";

const Footer: React.FC = () => {
  const {Footer} = Layout;
  const {Panel} = Collapse;

  const [state, setState] = useState({
    faq: false,
    forDev: false,
    history: false
  });

  const copySeed = () => {
    copy(localStorage.getItem('seed')!);
    message.success('Wallet seed copied!')
  }

  const handleCancel = () => {
    setState({faq: false, forDev: false, history: false});
  };

  return (
    <Footer style={{textAlign: "center"}}>
      {(window.location.pathname === "/" || window.location.pathname === "/multi" || window.location.pathname.includes('create')) && (
        <div className="actions">
          <Button
            onClick={() => setState({...state, history: true})}
            icon="calendar"
            size="small"
          >
            History
          </Button>
          <Button
            onClick={() => setState({...state, faq: true})}
            icon="question-circle"
            size="small"
          >
            FAQ
          </Button>
          <Button
            onClick={() => setState({...state, forDev: true})}
            icon="setting"
            size="small"
          >
            API
          </Button>
        </div>
      )}

      <div className="content">
        <p className="powered-by">
          Powered by{" "}
          <a href="https://minter.network" target="_blank">
            Minter ❤
          </a>
        </p>

        {window.location.pathname !== "/" && !window.location.pathname.includes('create') && !window.location.pathname.includes('multi') &&
        <Button size="small" onClick={copySeed}>Mnemonic</Button>}
      </div>

      {/* HISTORY */}
      <Modal
        title="История"
        visible={state.history}
        onCancel={handleCancel}
        footer={
          <Button key="back" onClick={handleCancel}>
            Закрыть
          </Button>
        }
      >
        <History />
      </Modal>

      {/* FAQ */}
      <Modal
        title="Ответы на вопросы"
        visible={state.faq}
        onCancel={handleCancel}
        footer={
          <Button key="back" onClick={handleCancel}>
            Закрыть
          </Button>
        }
      >
        <Collapse accordion>
          <Panel header="Насколько безопасны переводы?" key="1">
            <p>
              Безопаснось высока. На сервере установлена защита от перебора
              ссылок (а их вариантов более чем 10<sup>66</sup>). Рекомендуется
              дополнительно использовать пароль. Все пароли и Seed фразы
              хранятся в зашифрованном виде.
            </p>
          </Panel>
          <Panel header="Есть ли ограничения в переводах?" key="2">
            <p>Нет.</p>
            <p>
              Вы можете отправить любое количество монет (в том числе различных)
              в любое время, достаточно знать адрес кошелька.
            </p>
          </Panel>
          <Panel header="Как вернуть средства обратно?" key="3">
            <p>
              При создании кошелька вы получаете Seed. Если ссылка была
              скомпрометирована, вы можете успеть вернуть свои средства,
              например через консоль.
            </p>
          </Panel>
        </Collapse>
      </Modal>

      {/* FOR DEVELOPERS */}
      <Modal
        title="Для разработчиков"
        visible={state.forDev}
        onCancel={handleCancel}
        footer={
          <Button key="back" onClick={handleCancel}>
            Закрыть
          </Button>
        }
      >
        <p>
          У нас открытое API, и вы можете его использовать для массовых платежей
          и генерировать неограниченное количество адресов.
        </p>
        <p>
          Так же вы можете добавить свой сервис (например, как NUT). Для этого
          сделайте Pull Request, либо свяжитесь с @bipAngel.
        </p>

        <a href="https://github.com/kanitelk/minter-push" target="_blank">
          Документация на GitHub
        </a>
        <br/>
        <a href="https://app.swaggerhub.com/apis-docs/kanitelk/tap/" target="_blank">
          Документация API на Swagger
        </a>
      </Modal>
    </Footer>
  );
};

export default Footer;
