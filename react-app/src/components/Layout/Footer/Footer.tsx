import { Layout } from 'antd';
import React from 'react';

const Footer: React.FC = () => {
  const { Footer } = Layout;
  return (
    <Footer style={{ textAlign: "center" }}>
      Powered by <a href="https://minter.network" target="_blank">Minter</a>
    </Footer>
  );
}

export default Footer;