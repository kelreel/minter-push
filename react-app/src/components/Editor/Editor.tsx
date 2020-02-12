import { observer } from "mobx-react-lite";
import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppStoreContext } from "../../stores/appStore";
import "./Editor.scss";
import { Card, Collapse, Input, Switch, Select, Button } from "antd";
import { PresetStoreContext } from "../../stores/presetStore";
import { SketchPicker, AlphaPicker } from "react-color";

const Editor: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);

  const { Panel } = Collapse;
  const { Option } = Select;

  const [state, setState] = useState({
    headerColor: false,
    backgroundColor: false,
    titlesColor: false,
    cardsColor: false,
    cardsTextColor: false,
    balanceColor: false,
    categoryTitleColor: false,
    cover: false
  });

  useEffect(() => {
    window.document.title = pStore.title;
  }, [pStore.title]);

  const handleCloseCover = () =>
    setState({
      ...state,
      backgroundColor: false,
      titlesColor: false,
      cardsColor: false,
      cardsTextColor: false,
      headerColor: false,
      balanceColor: false,
      categoryTitleColor: false,
      cover: false
    });

  const { t, i18n } = useTranslation();

  return (
    <>
      <Collapse className="editor" bordered={false} accordion>
        {state.cover && (
          <div onClick={handleCloseCover} className="picker-cover"></div>
        )}

        {/* HEADER */}
        <Panel showArrow header="Header" key="1">
          <div className="switch">
            <p>Logo</p>
            <Switch
              size="small"
              defaultChecked={pStore.showLogo}
              onChange={e => (pStore.showLogo = e)}
            />
          </div>
          <div className="switch">
            <p>Show Title</p>
            <Switch
              size="small"
              defaultChecked={pStore.showTitle}
              onChange={e => (pStore.showTitle = e)}
            />
          </div>
          {pStore.showTitle && (
            <div className="switch">
              <p>Greeting</p>
              <Switch
                size="small"
                defaultChecked={pStore.greeting}
                onChange={e => (pStore.greeting = e)}
              />
            </div>
          )}
          {pStore.showTitle && (
            <div className="item">
              <p>Title</p>
              <Input
                placeholder="Nut Loyalty"
                onChange={e => (pStore.title = e.target.value)}
              />
            </div>
          )}
          <div className="item">
            <p>Image</p>
            <Input
              placeholder="https://..."
              onChange={e => (pStore.logoImg = e.target.value)}
            />
          </div>
          <div className="item">
            <div className="switch">
              <p>Background</p>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  outline: "1px solid black",
                  background: pStore.headerBgc
                }}
                onClick={() =>
                  setState({
                    ...state,
                    headerColor: !state.headerColor,
                    cover: true
                  })
                }
              ></div>
            </div>

            {state.headerColor && (
              <div className="picker">
                <SketchPicker
                  color={pStore.headerBgc}
                  onChangeComplete={color =>
                    (pStore.headerBgc = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                  }
                />
              </div>
            )}
          </div>
        </Panel>

        {/* BACKGROUND */}
        <Panel showArrow header="Background" key="2">
          <div className="switch">
            <p>Background Color</p>
            <div
              style={{
                width: "20px",
                height: "20px",
                outline: "1px solid black",
                background: pStore.backgroundColor
              }}
              onClick={() =>
                setState({
                  ...state,
                  backgroundColor: !state.backgroundColor,
                  cover: true
                })
              }
            ></div>
            {state.backgroundColor && (
              <div className="picker">
                <SketchPicker
                  color={pStore.headerBgc}
                  onChangeComplete={color =>
                    (pStore.backgroundColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                  }
                />
              </div>
            )}
          </div>
          <div className="item">
            <p>Image</p>
            <Input
              placeholder="https://..."
              onChange={e => (pStore.background = e.target.value)}
            />
          </div>
          {pStore.background && (
            <div className="item">
              <p>Background repeat</p>
              <Select
                value={pStore.backgroundRepeat!}
                disabled={!pStore.background}
                onChange={(val: string) => {
                  pStore.backgroundRepeat = val;
                  console.log(pStore.backgroundRepeat);
                }}
              >
                <Option value="no-repeat">No repeat</Option>
                <Option value="repeat">Repeat</Option>
                <Option value="repeat-x">Repeat X</Option>
                <Option value="repeat-y">Repeat Y</Option>
                <Option value="space">Space</Option>
                <Option value="round">Round</Option>
              </Select>
            </div>
          )}
        </Panel>

        {/* BALANCE CARD */}
        <Panel showArrow header="Balance Card" key="3">
          <div className="switch">
            <p>Payload Message</p>
            <Switch
              size="small"
              defaultChecked={pStore.showPaylaod}
              onChange={e => (pStore.showPaylaod = e)}
            />
          </div>
          <div className="switch">
            <p>Local Currency Balance</p>
            <Switch
              size="small"
              defaultChecked={pStore.showLocalBalance}
              onChange={e => (pStore.showLocalBalance = e)}
            />
          </div>
          <div className="switch">
            <p>Background Color</p>
            <div
              style={{
                width: "20px",
                height: "20px",
                outline: "1px solid black",
                background: pStore.balanceBgc
              }}
              onClick={() =>
                setState({
                  ...state,
                  balanceColor: !state.balanceColor,
                  cover: true
                })
              }
            ></div>
            {state.balanceColor && (
              <div className="picker">
                <SketchPicker
                  color={pStore.balanceBgc}
                  onChangeComplete={color =>
                    (pStore.balanceBgc = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                  }
                />
              </div>
            )}
          </div>
        </Panel>

        {/* CARD STYLES */}
        <Panel showArrow header="Cards Style" key="4">
          <div className="switch">
            <p>Show categories name</p>
            <Switch
              size="small"
              defaultChecked={pStore.showCategoryTitle}
              onChange={e => (pStore.showCategoryTitle = e)}
            />
          </div>
          <div className="switch">
            <p>Category Title Color</p>
            <div
              style={{
                width: "20px",
                height: "20px",
                outline: "1px solid black",
                background: pStore.categoryTitleColor
              }}
              onClick={() =>
                setState({
                  ...state,
                  categoryTitleColor: true,
                  cover: true
                })
              }
            ></div>
            {state.categoryTitleColor && (
              <div className="picker">
                <SketchPicker
                  color={pStore.categoryTitleColor}
                  onChangeComplete={color =>
                    (pStore.categoryTitleColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                  }
                />
              </div>
            )}
          </div>
          <div className="switch">
            <p>Card Background Color</p>
            <div
              style={{
                width: "20px",
                height: "20px",
                outline: "1px solid black",
                background: pStore.cardsBgc
              }}
              onClick={() =>
                setState({
                  ...state,
                  cardsColor: !state.cardsColor,
                  cover: true
                })
              }
            ></div>
            {state.cardsColor && (
              <div className="picker">
                <SketchPicker
                  color={pStore.cardsBgc}
                  onChangeComplete={color =>
                    (pStore.cardsBgc = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                  }
                />
              </div>
            )}
          </div>
          <div className="switch">
            <p>Card Title Color</p>
            <div
              style={{
                width: "20px",
                height: "20px",
                outline: "1px solid black",
                background: pStore.cardsTextColor
              }}
              onClick={() =>
                setState({
                  ...state,
                  cardsTextColor: !state.cardsTextColor,
                  cover: true
                })
              }
            ></div>
            {state.cardsTextColor && (
              <div className="picker">
                <SketchPicker
                  color={pStore.cardsTextColor}
                  onChangeComplete={color =>
                    (pStore.cardsTextColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
                  }
                />
              </div>
            )}
          </div>
        </Panel>

        {/* TARGETS */}
        <Panel showArrow header="Targets" key="5">
          <div className="switch">
            <p>Transfers</p>
            <Switch
              size="small"
              defaultChecked={pStore.showTransfers}
              onChange={e => (pStore.showTransfers = e)}
            />
          </div>
          <div className="switch">
            <p>Services & Games</p>
            <Switch
              size="small"
              defaultChecked={pStore.showLoyalty}
              onChange={e => (pStore.showLoyalty = e)}
            />
          </div>
          <div className="switch">
            <p>Shops</p>
            <Switch
              size="small"
              defaultChecked={pStore.showShops}
              onChange={e => (pStore.showShops = e)}
            />
          </div>
        </Panel>

        {/* FOOTER */}
        <Panel showArrow header="Footer" key="6">
          <div className="switch">
            <p>Show Footer</p>
            <Switch
              size="small"
              defaultChecked={pStore.showFooter}
              onChange={e => (pStore.showFooter = e)}
            />
          </div>
        </Panel>
      </Collapse>
      <div className="actions">
        <Button>Export</Button>
      </div>
    </>
  );
});

export default Editor;
