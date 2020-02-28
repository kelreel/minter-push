import { createBrowserHistory } from "history";
import {Modal} from "antd";
const history = createBrowserHistory();

history.listen(() => {
  Modal.destroyAll();
});

export default history
