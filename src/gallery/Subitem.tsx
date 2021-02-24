import DragAvatar from "../dragAndDrop/DragAvatar";
import { cls, colors, css, utils } from "../infra";
import * as items from "../state";
import * as c from "./constants";

type Props = {
  item: Item;
  allItems: Items;
  itemIdBeingPlayed: string | undefined;
  dragState: items.DragState | undefined;
};

const Subitem = ({ item, allItems, itemIdBeingPlayed, dragState }: Props) => {
  const l = (id: string) => {
    console.log(allItems[id].title);
    return id;
  };
  return (
    <div
      className={utils.cn({
        [cls.subtrack]: true,
        [cls.subtrackBeingPlayed]: item.id == itemIdBeingPlayed,
      })}
      onMouseMove={
        dragState && dragState.type == "draggingItem"
          ? (e) => DragAvatar.mouseMoveOverGallerySubitemDuringDrag(e, item)
          : undefined
      }
      onMouseDown={(e) => {
        e.stopPropagation();
        items.actions.mouseDownOnItem(l(item.id), {
          x: e.clientX,
          y: e.clientY,
        });
      }}
      onClick={() => {
        if (items.isContainer(item)) {
          const firstVideo = items.getFirstVideo(item, allItems);
          if (firstVideo) {
            items.actions.playVideo(firstVideo.id);
          }
        } else items.actions.playVideo(item.id);
      }}
    >
      <img
        src={items.getFirstImage(item, allItems)}
        className={cls.subtrackImage + " " + getSubtrackImageType(item)}
        alt=""
      />
      <span>{item.title}</span>
    </div>
  );
};

export default Subitem;

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

css.parentChild(cls.appDuringItemDrag, cls.subtrack, {
  cursor: "grabbing",
  backgroundColor: "transparent",
});

css.class2(cls.subtrack, cls.subtrackBeingPlayed, {
  backgroundColor: colors.primary,
});

css.lastOfType(cls.subtrack, {
  borderBottom: "none",
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
