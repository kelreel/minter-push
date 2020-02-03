import { observable } from 'mobx';
import { createContext } from 'react';

class PresetStore {
  @observable background: string | null = null;
  @observable showLogo: boolean = true;
  @observable headerBgc: string = 'rgba(255, 255, 255, 1)';
}

export const PresetStoreContext = createContext(new PresetStore());
