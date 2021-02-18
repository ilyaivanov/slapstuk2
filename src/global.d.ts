type valueof<T> = T[keyof T];

type Items = { [id: string]: Item };

type Item = ItemContainer | YoutubeVideo;

type ItemContainer =
  | YoutubePlaylist
  | YoutubeChannel
  | Folder
  | SearchContainer;

type CommonItemProperties = {
  id: string;
  title: string;
};

type CommonContainerProperties = {
  //these common properties consume Firebase storage
  //consider maybe reducing their name length
  children: string[];
  isOpenFromSidebar?: boolean;
  isCollapsedInGallery?: boolean;
};

type Folder = {
  type: "folder";
} & CommonItemProperties &
  CommonContainerProperties;

type SearchContainer = {
  type: "search";
  searchTerm: string;
  isLoading?: boolean;
  nextPageToken?: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubePlaylist = {
  type: "YTplaylist";
  playlistId: string;
  isLoading?: boolean;
  nextPageToken?: string;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeChannel = {
  type: "YTchannel";
  channelId: string;
  isLoading?: boolean;
  nextPageToken?: string;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeVideo = {
  type: "YTvideo";
  videoId: string;
} & CommonItemProperties;
