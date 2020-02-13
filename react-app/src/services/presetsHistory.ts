// @ts-nocheck

import { message } from "antd";
import {Preset} from "../stores/presetStore";

export const getSavedPresets = (): Array<Preset> | null => {
  try {
    let presets = localStorage.getItem("presets");
    return JSON.parse(presets);
  } catch (error) {
    console.log(error);
  }
};

export const savePreset = (preset: Preset) => {
  try {
    let presets = getSavedPresets();
    if (!presets) presets = [];
    if (presets.length > 9) presets.splice(-1,1);
    presets.unshift(preset);
    localStorage.setItem("presets", JSON.stringify(presets));
    message.success('Preset saved locally')
  } catch (error) {
    console.log(error)
    message.error("Error while saving preset");
  }
};

export const clearPresets = () => {
  localStorage.removeItem('presets')
}
