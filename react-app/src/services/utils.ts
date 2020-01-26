import i18n from "../i18n";

export const shortAddress = (address: string): string => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
};


export const getLocale = () => {
  return i18n.language.substring(0,2);
}