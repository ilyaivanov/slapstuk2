import { cls, colors, css, utils } from "../infra";
import * as items from "../state";

const CardTriangle = ({ item }: { item: Item }) => (
  <div
    className={cls.cardTypeBoxTriangleContainer}
    onClick={(e) => {
      console.log("TODO: perform scroll to this card");
    }}
  >
    <div
      title={
        items.isFolder(item)
          ? "You created this Folder (click to scroll to)"
          : items.isChannel(item)
          ? "Youtube Channel (click to scroll to)"
          : items.isPlaylist(item)
          ? "Youtube Playlist (click to scroll to)"
          : ""
      }
      className={
        cls.cardTypeBoxTriangle +
        " " +
        (items.isFolder(item)
          ? cls.cardTypeBoxTriangleFolder
          : items.isChannel(item)
          ? cls.cardTypeBoxTriangleChannel
          : items.isPlaylist(item)
          ? cls.cardTypeBoxTrianglePlaylist
          : "")
      }
    ></div>
    <div className={cls.cardTypeBoxTextContainer}>
      {items.isFolder(item)
        ? "F"
        : items.isPlaylist(item)
        ? "P"
        : items.isChannel(item)
        ? "C"
        : ""}
    </div>
  </div>
);
export default CardTriangle;
const triangleWidth = 25;

css.class(cls.cardTypeBoxTriangleContainer, {
  position: "absolute",
  pointerEvents: "none",
  top: 0,
  right: 0,
  width: triangleWidth,
  height: triangleWidth,
});

css.class(cls.cardTypeBoxTextContainer, {
  position: "absolute",
  top: 1,
  right: 4,
  fontSize: 12,
  fontWeight: "bolder",
  color: "white",
});

css.class(cls.cardTypeBoxTriangle, {
  width: 0,
  height: 0,
  pointerEvents: "auto",
  borderLeft: `${triangleWidth}px solid transparent`,
});

const triangleAlpha = 0.6;

const triangleBorder = (hex: string, alpha: number) =>
  `${triangleWidth}px solid ${utils.hexToRGBA(hex, alpha)}`;

css.class(cls.cardTypeBoxTrianglePlaylist, {
  borderTop: triangleBorder(colors.playlistColor, triangleAlpha),
});

css.class(cls.cardTypeBoxTriangleChannel, {
  borderTop: triangleBorder(colors.channelColor, triangleAlpha),
});

css.class(cls.cardTypeBoxTriangleFolder, {
  borderTop: triangleBorder(colors.folderColor, triangleAlpha),
});

css.hover(cls.cardTypeBoxTrianglePlaylist, {
  borderTop: triangleBorder(colors.playlistColor, 1),
});

css.hover(cls.cardTypeBoxTriangleChannel, {
  borderTop: triangleBorder(colors.channelColor, 1),
});

css.hover(cls.cardTypeBoxTriangleFolder, {
  borderTop: triangleBorder(colors.folderColor, 1),
});

export const getItemColor = (item: Item): string => {
  if (items.isFolder(item)) return colors.folderColor;
  if (items.isChannel(item)) return colors.channelColor;
  if (items.isPlaylist(item)) return colors.playlistColor;
  if (items.isVideo(item)) return colors.videoColor;
  return "white";
};
