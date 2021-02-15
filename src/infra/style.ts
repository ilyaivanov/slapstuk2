import { ClassName, ids } from "./keys";
// import * as dom from "./dom";
import * as CSS from "csstype";
import * as colors from "./colors";
export type Styles = CSS.Properties<string | number>;

const dom = {
  root: document.getElementById(ids.root) as HTMLElement,
};
const s = document.createElement("style");
document.head.appendChild(s);

export const cssClass = (clas: ClassName, styles: Styles) => {
  const text = cssToString("." + clas, styles);
  s.innerHTML += text;
};

export const cssClassOnHover = (clas: ClassName, styles: Styles) => {
  const text = cssToString("." + clas + ":hover", styles);
  s.innerHTML += text;
};
export const cssClassOnActive = (clas: ClassName, styles: Styles) => {
  const text = cssToString("." + clas + ":active", styles);
  s.innerHTML += text;
};

export const css = (selector: string | string[], styles: Styles) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  const text = cssToString(res, styles);
  s.innerHTML += text;
};

export const cssTag = (
  elementName: keyof HTMLElementTagNameMap,
  props: Styles
) => (s.innerHTML += cssToString(elementName, props));

export const cssText = (text: string) => {
  s.innerHTML += text;
};

const cssToString = (selector: string, props: Styles) => {
  const div = document.createElement("div");
  Object.assign(div.style, convertNumericStylesToPixels(props));
  return `${selector} {
    ${div.style.cssText}
  }
  `;
};

export const styles = {
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  } as const,
  overlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
  } as const,
  absoluteTopRight: (top: number, right: number) =>
    ({
      position: "absolute",
      top: top + "px",
      right: right + "px",
    } as const),
  absoluteTopLeft: (top: number, left: number) =>
    ({
      position: "absolute",
      top: top + "px",
      left: left + "px",
    } as const),
  rotate: (deg: number) => ({
    transform: `rotateZ(${deg}deg)`,
  }),

  cssTextForScrollBar: (
    className: ClassName,
    { width, height }: { width?: number; height?: number }
  ) =>
    `
  .${className}::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  
  .${className}::-webkit-scrollbar-thumb {
    background-color: ${colors.scrollBar};
  }
  
  .${className}:hover::-webkit-scrollbar {
    ${width ? "width: " + width + "px" : ""}
    ${height ? "height: " + height + "px" : ""}
  }`,

  cssPlayerHeightVariable: "-player-height",
  //this variable is used to set maxHeight for cards
  setPlayerHeightRootVariable: (height: number) =>
    dom.root.style.setProperty("--player-height", `${height}px`),

  cssLeftSidebarWidthVariable: "var(--sidebar-left-width)",

  setLeftSidebarWidth: (width: number) =>
    dom.root.style.setProperty("--sidebar-left-width", `${width}px`),

  cssRightSidebarWidthVariable: "var(--sidebar-right-width)",

  setRightSidebarWidth: (width: number) =>
    dom.root.style.setProperty("--sidebar-right-width", `${width}px`),
  cancelAllCurrentAnimations: (elem: HTMLElement) =>
    elem.getAnimations().forEach((a) => a.cancel()),
};

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  zIndex: 1,
  opacity: 1,
  flex: 1,
  fontWeight: 1,
};
export const convertNumericStylesToPixels = (
  s: Styles
): Partial<CSSStyleDeclaration> => {
  let res: any = {};
  const sCo = s as any;
  Object.keys(s).forEach((key) => {
    if (
      typeof sCo[key] == "string" ||
      !!(whitelist as any)[key] ||
      sCo[key] === 0
    )
      res[key] = sCo[key] + "";
    else res[key] = sCo[key] + "px";
  });
  return res;
};
