import React from "react";
import { cls, colors, css, icons, utils } from "../infra";
import { actions, RenameState, isOpenAtSidebar, getItemColor } from "../items";

const PADDING_PER_LEVEL = 15;
const BASE_PADDING = 4;
export const getPaddingForLevel = (level: number) =>
  BASE_PADDING + level * PADDING_PER_LEVEL;

type RowProps = {
  item: Item;
  level: number;
  isFocused?: boolean;
  isSelected?: boolean;
  onChevronClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  renameState: RenameState | undefined;
};
const Row = ({
  item,
  isFocused,
  isSelected,
  level,
  onChevronClick,
  renameState,
}: RowProps) => {
  const isHome = item.id === "HOME";
  return (
    <div
      data-testid={"row-" + item.id}
      className={utils.cn({
        [cls.row]: true,
        [cls.rowFocused]: isFocused,
        [cls.rowSelected]: isSelected,
      })}
      style={{ paddingLeft: getPaddingForLevel(level) }}
      onClick={() => actions.selectItem(item.id)}
    >
      {!isFocused &&
        icons.chevron({
          className: utils.cn({
            [cls.rowChevronRotated]: isOpenAtSidebar(item),
            [cls.rowChevron]: true,
            [cls.rowIcon]: true,
          }),
          "data-testid": "chevron-" + item.id,
          onClick: onChevronClick,
        })}
      {!isHome &&
        (isFocused
          ? icons.arrow({
              className: cls.unfocusArrow + " " + cls.rowIcon,
              "data-testid": "unfocus-" + item.id,
              onClick: (e) => {
                e.stopPropagation();
                actions.unfocus();
              },
            })
          : icons.circle({
              className: cls.rowCircle + " " + cls.rowIcon,
              "data-testid": "circle-" + item.id,
              style: { color: getItemColor(item) },
              onClick: (e) => {
                e.stopPropagation();
                actions.focusItem(item);
              },
            }))}

      {renameState && renameState.itemBeingRenamed == item.id ? (
        <RowInputField id={item.id} name={renameState.newName} />
      ) : (
        <div data-testid={"rowText-" + item.id} className={cls.rowText}>
          {item.title}
        </div>
      )}

      <button
        className={cls.rowMenuButton}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          actions.assignUiState({
            contextMenu: {
              x: rect.left,
              y: rect.top,
              itemId: item.id,
            },
          });
          //stop ContextMenu view from firing click event
          e.stopPropagation();
        }}
      >
        {icons.threeDotsVertical({
          className: cls.rowMenuIcon + " " + cls.rowIcon,
          "data-testid": "menu-" + item.id,
        })}
      </button>
    </div>
  );
};

const RowInputField = ({ id, name }: { id: string; name: string }) => {
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") actions.finishRenamingItem();
  };
  return (
    <input
      type="text"
      className={cls.rowTitleInput}
      ref={(ref) => ref?.focus()}
      data-testid={"rowTitleInput-" + id}
      value={name}
      onKeyUp={onKeyUp}
      onChange={(e) => actions.setNewName(e.currentTarget.value)}
      onBlur={() => actions.finishRenamingItem()}
    />
  );
};

const ROW_HEIGHT = 27;
css.class(cls.row, {
  display: "flex",
  alignItems: "center",
  position: "relative",
  height: ROW_HEIGHT,
  cursor: "pointer",
});
css.hover(cls.row, {
  backgroundColor: colors.sidebarRowHover,
});

css.selector(`.${cls.row}.${cls.rowSelected}`, {
  backgroundColor: colors.selectedRow,
});
css.class(cls.rowText, {
  whiteSpace: "nowrap",
});

css.class(cls.rowTitleInput, {
  flex: 1,
  fontSize: 16,
  border: "none",
});
css.class(cls.rowFocused, {
  fontWeight: "bold",
  fontSize: 20,
  paddingLeft: 8,
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
  minWidth: 16,
  height: 16,
  marginRight: 4,
});
css.class(cls.rowChevron, {
  width: 13,
  minWidth: 13,
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
  minWidth: 9,
  height: 9,
  marginRight: 6,
  marginLeft: 4,
});

css.class(cls.rowMenuButton, {
  position: "absolute",
  cursor: "pointer",
  top: 5,
  right: (ROW_HEIGHT - 15) / 2,
  height: 10,
  width: 10,
  borderRadius: 5,
  opacity: 0,
  backgroundColor: "transparent",
  border: "none",
  transition: "opacity 100ms ease-out",
});

css.focus(cls.rowMenuButton, {
  outline: 0,
});

css.class(cls.rowMenuIcon, {
  height: 15,
});

css.parentHover(cls.row, cls.rowMenuButton, {
  opacity: 1,
});

css.parentHover(cls.rowMenuButton, cls.rowMenuIcon, {
  color: colors.iconHover,
  transform: "scale(1.2)",
});

export default Row;
