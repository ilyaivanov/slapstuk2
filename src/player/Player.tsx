import { useEffect } from "react";
import { cls, css, ids, utils } from "../infra";
import { play, addEventListener } from "./youtubePlayer";
import * as state from "../state";
type Props = {
  itemId: string | undefined;
  allItems: Items;
};

const Player = ({ itemId, allItems }: Props) => {
  useEffect(() => {
    if (itemId) {
      const item = allItems[itemId];
      if (state.isVideo(item)) play(item.videoId);
    }
  }, [itemId]);

  return (
    <div className={cls.player}>
      Player
      <div
        id={ids.youtubeIframe}
        className={utils.cn({ [cls.youtubePlayerHidden]: !itemId })}
      ></div>
    </div>
  );
};

addEventListener("videoEnd", () => {
  state.actions.playNextVideo();
});

css.class(cls.player, {
  position: "relative",
});

css.id(ids.youtubeIframe, {
  position: "fixed",
  zIndex: 100,
  bottom: 80,
  right: 20,
  height: 150,
  width: 400,
  opacity: 1,
  transform: "translate3d(0, 0, 0)",
  transition: "transform 400ms, opacity 400ms",
});

css.class(cls.youtubePlayerHidden, {
  pointerEvents: "none",
  opacity: 0,
  transform: "translate3d(0, 10px, 0)",
});

export default Player;
