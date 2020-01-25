import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./WalletCreated.scss";

type props = {
  address: string;
  seed: string;
  link: string;
};

const WalletCreated: React.FC<props> = ({ address, seed, link }) => {
  const { t, i18n } = useTranslation();
  return <p>{address}</p>;
};

export default WalletCreated;
