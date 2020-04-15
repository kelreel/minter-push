import { createBrowserHistory } from "history";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { createContext } from "react";

const browserHistory = createBrowserHistory();

const routerStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routerStore);