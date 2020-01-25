import { action, observable } from 'mobx';
import { createContext } from 'react';

const { walletFromMnemonic, isValidMnemonic } = require("minterjs-wallet");

class AppStore {
  @observable wallet: string | null = window.localStorage.getItem("wallet");
  @observable seed: string | null = window.localStorage.getItem("seed");

  constructor() { }

  @action async getUserData() { }

  @action async checkAuth() { }

  @action logout() { }

  @action async login(seed: string) { }
}

export const AppStoreContext = createContext(new AppStore());
