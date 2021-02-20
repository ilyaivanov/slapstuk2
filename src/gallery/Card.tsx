import React from "react";
import CardTriangle from "./CardTriangle";
import { cls, colors, css, utils } from "../infra";
import * as items from "../state";
import * as c from "./constants";
import CardPreviewImage from "./CardPreviewImage";
import LoadingNineDots from "../commonComponents/LoadingNineDots";
import LoadingStripe from "../commonComponents/LoadingStripe";
import Subitem from "./Subitem";
const PLAYER_HEIGHT = 40;

type Props = {
  item: Item;
  allItems: Items;
  itemIdBeingPlayed: string | undefined;
};

const Card = ({ item, allItems, itemIdBeingPlayed }: Props) => {
  const onSubtracksScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      utils.getScrollDistanceFromBottom(e.currentTarget) < 5 &&
      items.hasNextPage(item)
    ) {
      items.actions.loadItem(item);
    }
  };
  const isEmptyAndLoading = () =>
    items.isLoadingAnything(item) &&
    items.getChildren(item.id, allItems).length == 0;

  return (
    <div
      className={utils.cn({
        [cls.card]: true,
        [cls.cardBeingPlayed]: item.id === itemIdBeingPlayed,
      })}
    >
      <div
        className={cls.cardImageWithTextContainer}
        onClick={() => {
          if (items.isContainer(item)) {
            if (items.isNeedsToBeLoaded(item)) items.actions.loadItem(item);
            items.actions.toggleItemInGallery(item);
          } else items.actions.playVideo(item.id);
        }}
      >
        <CardPreviewImage item={item} allItems={allItems} />
        <div
          className={utils.cn({
            [cls.cardText]: true,
            [cls.cardTextForFolder]: items.isContainer(item),
          })}
        >
          {item.title}
        </div>
      </div>
      <div className={cls.subtracksContainer} onScroll={onSubtracksScroll}>
        {items.isOpenAtGallery(item) &&
          (isEmptyAndLoading() ? (
            <div className={cls.cardLoadingSpinnerContainer}>
              <LoadingNineDots />
            </div>
          ) : (
            items
              .getChildren(item.id, allItems)
              .map((item) => (
                <Subitem
                  key={item.id}
                  item={item}
                  allItems={allItems}
                  itemIdBeingPlayed={itemIdBeingPlayed}
                />
              ))
          ))}
        {items.isLoadingNextPage(item) && <LoadingStripe isActive isBottom />}
      </div>

      <CardTriangle item={item} />
    </div>
  );
};

export default Card;

css.class(cls.card, {
  color: "white",
  backgroundColor: colors.card,
  marginBottom: c.GALLERY_GAP,
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  overflowY: "hidden",
  position: "relative",
  maxHeight: `calc(100vh - ${c.GALLERY_GAP * 2}px - ${
    c.HEADER_HEIGHT
  }px - ${PLAYER_HEIGHT}px`,
  display: "flex",
  flexDirection: "column",
});

css.hover(cls.cardImageWithTextContainer, {
  backgroundColor: colors.cardHover,
});

css.hover(cls.card, {
  border: "1px solid rgba(255, 255, 255, 0.2)",
});

css.class2(cls.card, cls.cardBeingPlayed, {
  border: `1px solid ${colors.primary}`,
});

css.parentChild(cls.cardBeingPlayed, cls.cardImageWithTextContainer, {
  backgroundColor: colors.primary,
});

css.class(cls.cardText, {
  padding: c.CARD_PADDING,
  fontSize: 14,
  color: "rgb(220, 220, 220)",
  fontWeight: "normal",
  wordBreak: "break-word",
});

css.class(cls.cardTextForFolder, {
  fontSize: 16,
  color: "white",
  fontWeight: "bolder",
});
