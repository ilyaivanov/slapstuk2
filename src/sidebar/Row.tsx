import React from "react";
import { cls, colors, css, icons, utils } from "../infra";
import * as items from "../items";
const PADDING_PER_LEVEL = 15;
const BASE_PADDING = 4;
export const getPaddingForLevel = (level: number) =>
  BASE_PADDING + level * PADDING_PER_LEVEL;

type RowProps = {
  item: Item;
  level: number;
  isFocused?: boolean;
  onClick: () => void;
};
const Row = ({ item, isFocused, level, onClick }: RowProps) => {
  const isHome = item.id === "HOME";
  return (
    <div
      data-testid={"row-" + item.id}
      className={utils.cn({
        [cls.row]: true,
        [cls.rowFocused]: isFocused,
      })}
      style={{ paddingLeft: getPaddingForLevel(level) }}
    >
      {!isFocused &&
        icons.chevron({
          className: utils.cn({
            [cls.rowChevronRotated]: item.isOpen,
            [cls.rowChevron]: true,
            [cls.rowIcon]: true,
          }),
          "data-testid": "chevron-" + item.id,
          onClick: onClick,
        })}
      {!isHome &&
        (isFocused
          ? icons.arrow({
              className: cls.unfocusArrow + " " + cls.rowIcon,
              "data-testid": "unfocus-" + item.id,
              onClick: (e) => {
                e.stopPropagation();
                items.actions.unfocus();
              },
            })
          : icons.circle({
              className: cls.rowCircle + " " + cls.rowIcon,
              "data-testid": "circle-" + item.id,
              onClick: (e) => {
                e.stopPropagation();
                items.actions.focusItem(item);
              },
            }))}

      <div className={cls.rowText}>{item.title}</div>
    </div>
  );
};

css.class(cls.row, {
  display: "flex",
  alignItems: "center",
  height: 27,
});

css.class(cls.rowText, {
  lineHeight: 16,
});

css.class(cls.rowFocused, {
  fontWeight: "bold",
  fontSize: 20,
  marginLeft: 8,
});
css.class(cls.rowIcon, {
  cursor: "pointer",
  transition: "transform 150ms ease-in",
  color: colors.iconRegular,
});
css.hover(cls.rowIcon, {
  color: colors.iconHover,
  transform: "scale(1.2)",
});
css.class(cls.unfocusArrow, {
  width: 16,
  height: 16,
  marginRight: 4,
});
css.class(cls.rowChevron, {
  width: 13,
  height: 13,
  marginLeft: 6,
});

css.class(cls.rowChevronRotated, {
  transform: "rotateZ(90deg)",
});

css.hover(cls.rowChevronRotated, {
  transform: "scale(1.3) rotateZ(90deg)",
});

css.class(cls.rowCircle, {
  width: 9,
  height: 9,
  marginRight: 6,
  marginLeft: 4,
});

export default Row;
