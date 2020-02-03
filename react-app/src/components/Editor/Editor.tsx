import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../stores/appStore";
import "./Editor.scss";
import { Card, Collapse, Input, Switch } from "antd";
import { PresetStoreContext } from "../../stores/presetStore";
import { SketchPicker } from "react-color";

const Editor: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);

  const { Panel } = Collapse;

  const [state, setState] = useState({
    loading: false
  });

  const { t, i18n } = useTranslation();

  return (
    <Collapse className="editor" bordered={false} accordion>
      <Panel showArrow={false} header="Header" key="1">
        <div className="switch">
          <p>Logo</p>
          <Switch
            size="small"
            defaultChecked={pStore.showLogo}
            onChange={e => (pStore.showLogo = e)}
          />
        </div>
        <div className="item">
          <p>background</p>
          {pStore.headerBgc}
          <SketchPicker
            color={pStore.headerBgc}
            onChangeComplete={color =>
              (pStore.headerBgc = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
            }
          />
        </div>
      </Panel>
      <Panel showArrow={false} header="Background" key="2">
        <p>Background</p>
        <Input
          placeholder="IMG URLs"
          onChange={e => (pStore.background = e.target.value)}
        />
      </Panel>
    </Collapse>
  );
});

export default Editor;
