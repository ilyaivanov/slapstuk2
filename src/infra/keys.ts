import { findDuplicates } from "./utils";

export const ids = {
  root: "root",
} as const;

export const cls = {
  none: "",
} as const;

const duplicatedClasses = findDuplicates(Object.values(cls));
if (duplicatedClasses.length > 0)
  console.error(`Infra has duplicated clases: ${duplicatedClasses.join(", ")}`);

export const zIndexes = {};

export type ClassName = valueof<typeof cls>;
