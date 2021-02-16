import {
  cssClass,
  css as selector,
  cssClassOnHover,
  cssClassOnActive,
  cssText,
  Styles,
  styles,
} from "./style";

export { cls, ids, zIndexes } from "./keys";
export type { ClassName } from "./keys";
// export {
//   div,
//   findFirstByClass,
//   findById,
//   fragment,
//   DivDefinition,
//   EventsDefinition,
// } from "./dom";
// export * as dom from "./dom";
// export * as icons from "./icons";
export * as anim from "./animations";
export * as colors from "./colors";
export * as utils from "./utils";
// export * as itemEvents from "./events";
// import * as dom from "./dom";
// import * as anim from "./animations";

export const css = {
  id: (id: string, style: Styles) => selector("#" + id, style),
  tag: (tag: keyof HTMLElementTagNameMap, style: Styles) =>
    selector(tag, style),
  class: cssClass,
  active: cssClassOnActive,
  hover: cssClassOnHover,
  text: cssText,
  selector,
  styles,
};
