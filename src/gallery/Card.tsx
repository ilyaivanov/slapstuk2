import React from "react";
import CardTriangle from "./CardTriangle";
import { cls, CollapsibleContainer, colors, css, utils } from "../infra";
import * as items from "../state";
import * as c from "./constants";
import CardPreviewImage from "./CardPreviewImage";
import LoadingNineDots from "../commonComponents/LoadingNineDots";
import LoadingStripe from "../commonComponents/LoadingStripe";
import Subitem from "./Subitem";
import DragAvatar from "../dragAndDrop/DragAvatar";

type Props = {
  item: Item;
  allItems: Items;
  itemIdBeingPlayed: string | undefined;
  dragState: items.DragState | undefined;
};

const Card = React.memo(
  ({ item, allItems, itemIdBeingPlayed, dragState }: Props) => {
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

    const renderContent = () =>
      isEmptyAndLoading() ? (
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
              dragState={dragState}
            />
          ))
      );
    return (
      <div
        className={cls.cardContainer}
        onMouseMove={
          dragState && dragState.type == "draggingItem"
            ? (e) => DragAvatar.mouseMoveOverCardDuringDrag(e, item)
            : undefined
        }
      >
        <div
          className={utils.cn({
            [cls.card]: true,
            [cls.cardBeingPlayed]: item.id === itemIdBeingPlayed,
          })}
          onMouseDown={(e) =>
            items.actions.mouseDownOnItem(item.id, {
              x: e.clientX,
              y: e.clientY,
            })
          }
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
            <CollapsibleContainer isOpen={!items.isOpenAtGallery(item)}>
              {() => <CardPreviewImage item={item} allItems={allItems} />}
            </CollapsibleContainer>

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
            <CollapsibleContainer isOpen={items.isOpenAtGallery(item)}>
              {renderContent}
            </CollapsibleContainer>
            {items.isLoadingNextPage(item) && (
              <LoadingStripe isActive isBottom />
            )}
          </div>

          <CardTriangle item={item} />
        </div>
      </div>
    );
  }
);

export default Card;
css.class(cls.cardContainer, {
  paddingTop: c.GALLERY_GAP,
  paddingLeft: c.GALLERY_GAP / 2,
  paddingRight: c.GALLERY_GAP / 2,
});
css.selector(`.${cls.galleryColumn}:first-of-type .${cls.cardContainer}`, {
  paddingLeft: c.GALLERY_GAP,
});
css.selector(`.${cls.galleryColumn}:last-of-type .${cls.cardContainer}`, {
  paddingRight: c.GALLERY_GAP,
});
// css.firstOfType(cls.cardContainer, {
//   paddingTop: c.GALLERY_GAP,
// });
css.lastOfType(cls.cardContainer, {
  paddingBottom: c.GALLERY_GAP,
});
css.class(cls.card, {
  color: "white",
  backgroundColor: colors.card,
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  overflowY: "hidden",
  position: "relative",
  maxHeight: `calc(100vh - ${c.GALLERY_GAP * 2}px - ${c.HEADER_HEIGHT}px - ${
    c.PLAYER_HEIGHT
  }px`,
  display: "flex",
  flexDirection: "column",
});

css.hover(cls.cardImageWithTextContainer, {
  backgroundColor: colors.cardHover,
});

css.parentChild(cls.appDuringItemDrag, cls.cardImageWithTextContainer, {
  cursor: "grabbing",
  backgroundColor: "transparent",
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
