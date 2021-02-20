import {
  cssClass,
  css as selector,
  cssClassOnHover,
  cssClassOnActive,
  cssText,
  Styles,
  styles,
} from "./style";
import c from "./CollapsibleContainer";

export { cls, ids, zIndexes, tIds } from "./keys";
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
export * as icons from "./icons";
export * as anim from "./animations";
export * as colors from "./colors";
export * as utils from "./utils";
// export * as itemEvents from "./events";
// import * as dom from "./dom";
// import * as anim from "./animations";

export const CollapsibleContainer = c;

export const css = {
  id: (id: string, style: Styles) => selector("#" + id, style),
  tag: (tag: keyof HTMLElementTagNameMap, style: Styles) =>
    selector(tag, style),
  class: cssClass,
  class2: (c1: string, c2: string, style: Styles) =>
    selector(`.${c1}.${c2}`, style),
  parentChild: (c1: string, c2: string, style: Styles) =>
    selector(`.${c1} .${c2}`, style),
  active: cssClassOnActive,
  hover: cssClassOnHover,
  focus: (className: string, style: Styles) =>
    selector(`.${className}:focus`, style),
  lastOfType: (className: string, style: Styles) =>
    selector(`.${className}:last-of-type`, style),
  parentHover: (parentClass: string, childClass: string, style: Styles) =>
    selector(`.${parentClass}:hover .${childClass}`, style),
  text: cssText,
  selector,
  styles,
};
