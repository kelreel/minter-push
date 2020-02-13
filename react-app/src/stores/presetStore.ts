import {action, observable} from 'mobx';
import {createContext} from 'react';
import logo from '../assets/minter-logo-circle.svg'

export type Preset = {
    name: string | null;
    background: string | null;
    backgroundRepeat: string;
    backgroundColor: string;
    showLogo: boolean;
    headerBgc: string;
    greeting: boolean;
    logoImg: string | null;
    showTitle: boolean;
    title: string;
    showPayload: boolean;
    showLocalBalance: boolean;
    balanceBgc: string;
    showCategoryTitle: boolean;
    categoryTitleColor: string;
    cardsBgc: string;
    cardsTextColor: string;
    showFooter: boolean;
    showTransfers: boolean;
    showShops: boolean;
    showLoyalty: boolean;
}

class PresetStore {
    // Preset name
    @observable name: string | null = null;

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
    @observable showPayload: boolean = true;
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

    get currentPreset(): Preset {
        return {
            name: this.name,
            background: this.background,
            backgroundColor: this.backgroundColor,
            backgroundRepeat: this.backgroundRepeat,
            balanceBgc: this.balanceBgc,
            cardsBgc: this.cardsBgc,
            cardsTextColor: this.cardsTextColor,
            categoryTitleColor: this.categoryTitleColor,
            greeting: this.greeting,
            headerBgc: this.headerBgc,
            logoImg: this.logoImg,
            showCategoryTitle: this.showCategoryTitle,
            showFooter: this.showFooter,
            showLocalBalance: this.showLocalBalance,
            showLogo: this.showLogo,
            showLoyalty: this.showLoyalty,
            showPayload: this.showPayload,
            showShops: this.showShops,
            showTitle: this.showTitle,
            showTransfers: this.showTransfers,
            title: this.title
        }
    }

    get currentPresetString() {
        return JSON.stringify(this.currentPreset)
    }

    @action setPreset(preset: Preset) {
        this.name = preset.name;
        this.background = preset.background;
        this.backgroundColor = preset.backgroundColor;
        this.backgroundRepeat = preset.backgroundRepeat;
        this.balanceBgc = preset.balanceBgc;
        this.cardsBgc = preset.cardsBgc;
        this.cardsTextColor = preset.cardsTextColor;
        this.categoryTitleColor = preset.categoryTitleColor;
        this.greeting = preset.greeting;
        this.headerBgc = preset.headerBgc;
        this.logoImg = preset.logoImg;
        this.showCategoryTitle = preset.showCategoryTitle;
        this.showFooter = preset.showFooter;
        this.showLocalBalance = preset.showLocalBalance;
        this.showLogo = preset.showLogo;
        this.showLoyalty = preset.showLoyalty;
        this.showPayload = preset.showPayload;
        this.showShops = preset.showShops;
        this.showTitle = preset.showTitle;
        this.showTransfers = preset.showTransfers;
        this.title = preset.title
    }
}

export const PresetStoreContext = createContext(new PresetStore());
