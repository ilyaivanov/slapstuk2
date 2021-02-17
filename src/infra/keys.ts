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
  rowText: "",
  rowIcon: "",
  rowChevronRotated: "",
  rowChevron: "",
  unfocusArrow: "",
  rowCircle: "",
  childrenContainer: "",
  rowFocused: "",
  //Sidebar UI
  sidebarWidthAdjuster: "",
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
};

export const zIndexes = {};

export type ClassName = string;
