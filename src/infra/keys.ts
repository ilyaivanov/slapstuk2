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
  rowIcon: "",
  sidebarHeader: "",
  createFolderIcon: "",
  rowChevronRotated: "",
  rowChevron: "",
  unfocusArrow: "",
  rowCircle: "",
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
  //Utility
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
