const classes = {
  //Layout
  app: "",
  leftSidebar: "",
  rightSidebar: "",
  topbar: "",
  gallery: "",
  player: "",
  //Layout Utility
  appDuringDrag: "",
  //Sidebar
  //Sidebar Items
  row: "",
  rowSelected: "",
  rowText: "",
  icon: "",
  iconHidden: "",
  rowIcon: "",
  sidebarHeader: "",
  createFolderIcon: "",
  rowChevronRotated: "",
  rowChevron: "",
  unfocusArrow: "",
  rowCircle: "",
  sidebarFolderIcon: "",
  sidebarVideoIcon: "",
  sidebarChannelIcon: "",
  sidebarPlaylistIcon: "",
  childrenContainer: "",
  rowFocused: "",
  rowMenuIcon: "",
  rowMenuButton: "",
  rowTitleInput: "",
  //Sidebar UI
  sidebarWidthAdjuster: "",
  sidebarScrollArea: "",
  //Context Menu
  contextMenu: "",
  contextMenuRow: "",

  //Gallery
  galleryScrollArea: "",

  galleryColumnContainer: "",
  galleryColumn: "",

  //Gallery Cards
  card: "",
  cardText: "",
  cardTextForFolder: "",
  cardPreviewContainer: "",
  cardPreviewContainerClosed: "",
  cardImageWithTextContainer: "",
  subtracksContainer: "",
  cardTypeBoxTriangleContainer: "",
  cardTypeBoxTextContainer: "",
  cardTypeBoxTriangle: "",
  cardTypeBoxTrianglePlaylist: "",
  cardTypeBoxTriangleChannel: "",
  cardTypeBoxTriangleFolder: "",
  previewImage: "",
  emptyCardPreview: "",
  previewImageGrid: "",
  cardLoadingSpinnerContainer: "",
  overlay: "",
  //Gallery Subtracks
  subtrack: "",
  subtrackImage: "",
  subtrackChannelImage: "",
  subtrackFolderImage: "",
  subtrackPlaylistImage: "",
  //Utility
  galleryLoadingContainer: "",
  loadingStripe: "",
  loadingStripeBottom: "",
  loadingStripeActive: "",
  loadGrid: "",
  none: "",
};

export const cls = Object.keys(classes).reduce(
  (a, c) => ({
    ...a,
    [c]: c,
  }),
  {}
) as typeof classes;

export const ids = {
  root: "root",
} as const;

export const tIds = {
  toggleSidebar: "toggleSidebar",
  //Sidebar items

  //Context Menu
  contextMenuRename: "contextMenuEdit",
  contextMenuDelete: "contextMenuDelete",
};

export const zIndexes = {};

export type ClassName = string;
