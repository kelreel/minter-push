import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../stores/appStore";
import "./Editor.scss";
import { Card } from "antd";

const Editor: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const store = useContext(AppStoreContext);

  const [state, setState] = useState({
    visible,
    loading: false,
    certificate: "500",
    coin: ""
  });

  const { t, i18n } = useTranslation();


  return (
    <Card style={{width: '200px'}}>
      <p>Editor</p>
    </Card>
  )
});

export default Editor;
