import { observable } from 'mobx';
import { createContext } from 'react';
import logo from '../assets/minter-logo-circle.svg'

class PresetStore {
  // Layout
  @observable background: string | null = null;
  @observable backgroundRepeat: string = "no-repeat";
  @observable backgroundColor: string = "rgba(245, 245, 245, 1)";

  //  Header
  @observable showLogo: boolean = true;
  @observable headerBgc: string = "rgba(255, 255, 255, 1)";
  @observable greeting: boolean = true;
  @observable logoImg: string | null = logo;
  @observable showTitle: boolean = true;
  @observable title: string = "Push";

  // Balance Card
  @observable showPaylaod: boolean = true;
  @observable showLocalBalance: boolean = true;
  @observable balanceBgc: string = "rgba(255, 255, 255, 1)";

  // Cards category titles
  @observable showCategoryTitle: boolean = true;
  @observable categoryTitleColor: string = "rgba(78, 78, 78, 0.767)";

  // Cards Style
  @observable cardsBgc: string = "rgba(255, 255, 255, 1)";
  @observable cardsTextColor: string = "rgba(0, 0, 0, 0.85)";

  // Footer
  @observable showFooter: boolean = true;

  // Targets
  @observable showTransfers: boolean = true;
  @observable showShops: boolean = true;
  @observable showLoyalty: boolean = true;
}

export const PresetStoreContext = createContext(new PresetStore());
