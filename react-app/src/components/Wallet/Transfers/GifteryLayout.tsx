import "./Transfers.scss";

import {Avatar, Card, message} from "antd";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {AppStoreContext} from "../../../stores/appStore";
import {PresetStoreContext} from "../../../stores/presetStore";
import {getGifteryProducts} from "../../../services/gifteryApi";
import Giftery from "../../Modals/Giftery/Giftery";

type GifteryProduct = {
  id: number,
  title: string,
  brief: string,
  face_step: number,
  digital_acceptance: string,
  face_min: number,
  face_max: number,
  image_url: string,
  disclaimer: string,
  categories: number[],
  faces: number[]
}
type ProductsState = {
  games: Array<GifteryProduct>,
  internet: Array<GifteryProduct>,
  food: Array<GifteryProduct>,
  shops: Array<GifteryProduct>
}

const GifteryLayout: React.FC = observer(() => {
  const store = useContext(AppStoreContext);
  const pStore = useContext(PresetStoreContext);
  const {t, i18n} = useTranslation();

  const [state, setState] = useState<{ modal: boolean; products: ProductsState | null, currentItem: GifteryProduct | null }>({
    modal: false,
    products: null,
    currentItem: null
  });

  useEffect(() => {
    let getProducts = async () => {
      let r = await getGifteryProducts();
      setState({...state, products: r.data})
    }
    try {
      getProducts()
    } catch (error) {
      message.error('Error while loading Giftery products')
    }
  }, [])

  const cardPreset = {
    background: pStore.cardsBgc,
    border: `2px solid ${pStore.cardsBorder}`
  };

  const cardTextPreset = {
    color: pStore.cardsTextColor
  };

  const getCards = (category: keyof ProductsState) => {
    return state.products![category].map(item =>
      <Card
        style={cardPreset}
        bordered={false}
        key={item.id}
        onClick={() => {
          setState({...state, modal: false});
          setTimeout(() => {
            setState({...state, modal: true, currentItem: item});
          }, 0);
        }}
        className={`transfer-card`}
      >
        <Avatar
          style={{backgroundColor: "#682ED6"}}
          size={64}
          src={'https://' + item.image_url}
        />
        <h3 style={cardTextPreset}>{item.title}</h3>
      </Card>
    )
  }

  return (
    <>
      {/* FOOD */}
      {state.products?.food && <>
          <div
              className="title animated fadeInUp"
              style={{color: pStore.categoryTitleColor}}
          >
            {pStore.showCategoryTitle && <>{t('giftery.food')}</>}
          </div>

          <div className="shops animated fadeInUp">
            {getCards("food")}
          </div>
      </>}

      {/* INTERNET */}
      {state.products?.internet && <>
          <div
              className="title"
              style={{color: pStore.categoryTitleColor}}
          >
            {pStore.showCategoryTitle && <>{t('giftery.internet')}</>}
          </div>

          <div className="shops">
            {getCards("internet")}
          </div>
      </>}


      {/* SHOPS */}
      {state.products?.shops && <>
          <div
              className="title"
              style={{color: pStore.categoryTitleColor}}
          >
            {pStore.showCategoryTitle && <>{t('giftery.shops')}</>}
          </div>

          <div className="shops">
            {getCards("shops")}
          </div>
      </>}

      {/* GAMES */}
      {state.products?.games && <>
          <div
              className="title"
              style={{color: pStore.categoryTitleColor}}
          >
            {pStore.showCategoryTitle && <>{t('giftery.games')}</>}
          </div>

          <div className="shops">
            {getCards('games')}
          </div>
      </>}


      {state.currentItem &&
      <Giftery visible={state.modal} brief={state.currentItem.brief} digital_acceptance={state.currentItem?.brief}
               disclaimer={state.currentItem?.disclaimer} face_max={state.currentItem?.face_max}
               face_min={state.currentItem?.face_min} face_step={state.currentItem?.face_step}
               id={state.currentItem?.id} image_url={state.currentItem?.image_url} title={state.currentItem?.title}
               faces={state.currentItem?.faces}
      />}
    </>
  );
});

export default GifteryLayout;
