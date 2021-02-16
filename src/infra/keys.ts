let startId = 5;
const id = () => "c" + startId++;

export const cls = {
  row: id(), //c5 (class number matches line number)
  childrenContainer: id(), //c6 etc
  rotated: id(),
  rowFocused: id(),
  rowChevron: id(),
  none: "",
} as const;

export const ids = {
  root: "root",
} as const;

export const zIndexes = {};

export type ClassName = valueof<typeof cls>;
