import React from "react";
import CardTriangle from "./CardTriangle";
import { cls, colors, css, utils } from "../infra";
import * as items from "../state";
import * as c from "./constants";
import CardPreviewImage from "./CardPreviewImage";
import LoadingNineDots from "../commonComponents/LoadingNineDots";
import LoadingStripe from "../commonComponents/LoadingStripe";
const PLAYER_HEIGHT = 40;
const Card = ({ item, allItems }: { item: Item; allItems: Items }) => {
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
    <div className={cls.card}>
      <div
        className={cls.cardImageWithTextContainer}
        onClick={() => {
          if (items.isContainer(item)) {
            if (items.isNeedsToBeLoaded(item)) items.actions.loadItem(item);
            items.actions.toggleItemInGallery(item);
          }
          //else: play video
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
                <SubTrack key={item.id} item={item} allItems={allItems} />
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

css.hover(cls.card, {
  border: "1px solid rgba(255, 255, 255, 0.2)",
});

//Subtracks

const SubTrack = ({ item, allItems }: { item: Item; allItems: Items }) => (
  <div className={cls.subtrack}>
    <img
      src={items.getFirstImage(item, allItems)}
      className={cls.subtrackImage + " " + getSubtrackImageType(item)}
      alt=""
    />
    <span>{item.title}</span>
  </div>
);
const getSubtrackImageType = (item: Item) =>
  items.isChannel(item)
    ? cls.subtrackChannelImage
    : items.isFolder(item)
    ? cls.subtrackFolderImage
    : items.isPlaylist(item)
    ? cls.subtrackPlaylistImage
    : cls.none;

css.class(cls.subtracksContainer, {
  overflowY: "overlay" as any,
});

css.lastOfType(cls.subtrack, {
  borderBottom: "none",
});

css.text(css.styles.cssTextForScrollBar(cls.subtracksContainer, { width: 8 }));

css.class(cls.subtrack, {
  padding: `5px ${c.CARD_PADDING}px`,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: 13,
  wordBreak: "break-word",
  color: "rgb(220, 220, 220)",
  fontWeight: "normal",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
});
css.hover(cls.subtrack, {
  backgroundColor: colors.cardHover,
});

css.class(cls.subtrackImage, {
  width: 32,
  minWidth: 32,
  height: 32,
  overflow: "hidden",
  position: "relative",
  borderRadius: 4,
  marginRight: 8,
  objectFit: "cover",
});

css.class(cls.subtrackPlaylistImage, {
  border: `1px solid ${colors.playlistColor}`,
});

css.class(cls.subtrackChannelImage, {
  border: `1px solid ${colors.channelColor}`,
});

css.class(cls.subtrackFolderImage, {
  border: `1px solid ${colors.folderColor}`,
});

css.class(cls.cardLoadingSpinnerContainer, {
  paddingBottom: 10,
});
