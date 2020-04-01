import { Modal } from "antd";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

history.listen(() => {
  Modal.destroyAll();
});

export default history;
