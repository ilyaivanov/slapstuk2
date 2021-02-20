import { ids } from "../infra";

var player: any;
var videoRequested: string | undefined;
var isLoadingPlayer = false;
var isReady = false;

//TODO: create player types
declare const YT: any;

export function play(videoId: string) {
  videoRequested = videoId;
  if (!player && !isLoadingPlayer) init();
  else if (isReady) {
    player.loadVideoById(videoId);
  }
}

function init() {
  isLoadingPlayer = true;
  const tag = document.createElement("script");

  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  //@ts-ignore
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

//@ts-ignore
global.onYouTubeIframeAPIReady = () => {
  isLoadingPlayer = false;
  player = new YT.Player(ids.youtubeIframe, {
    height: "100%",
    width: "100%",
    videoId: videoRequested,
    playerVars: { autoplay: 1 /*, 'controls': 0 */ },
    events: {
      onReady: () => {
        isReady = true;
      },
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerStateChange(event: any) {
  if (event.data === YT.PlayerState.ENDED) {
    videoEndEvents.forEach((handler) => handler());
  }
}

type Handler = () => void;

const videoEndEvents: Handler[] = [];

export const addEventListener = (eventType: "videoEnd", handler: Handler) => {
  videoEndEvents.push(handler);
};

export const removeEventListener = (
  eventType: "videoEnd",
  handler: Handler
) => {
  videoEndEvents.splice(videoEndEvents.indexOf(handler));
};
