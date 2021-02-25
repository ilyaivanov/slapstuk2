import React from "react";
import DragAvatar from "../dragAndDrop/DragAvatar";
import { cls, colors, css, icons, utils } from "../infra";
import * as items from "../state";
import { actions, RenameState, isOpenAtSidebar } from "../state";

export const PADDING_PER_LEVEL = 15;
const BASE_PADDING = 4;

export const getPaddingForLevel = (level: number) =>
  BASE_PADDING + level * PADDING_PER_LEVEL;

type RowProps = {
  item: Item;
  level: number;
  isFocused?: boolean;
  isSelected?: boolean;
  dragState: items.DragState | undefined;
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
  dragState,
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
      onClick={() => {
        if (items.isVideo(item)) actions.playVideo(item.id);
        else actions.selectItem(item.id);
      }}
      onMouseDown={(e) =>
        actions.mouseDownOnItem(item.id, { x: e.clientX, y: e.clientY })
      }
      onMouseMove={
        dragState && dragState.type == "draggingItem"
          ? (e) => DragAvatar.mouseMoveOverSidebarRowDuringDrag(e, item, level)
          : undefined
      }
    >
      {!isFocused &&
        icons.chevron({
          className: utils.cn({
            [cls.rowChevronRotated]: isOpenAtSidebar(item),
            [cls.rowChevron]: true,
            [cls.icon]: true,
            [cls.iconHidden]:
              (items.isFolder(item) && item.children.length === 0) ||
              items.isVideo(item),
          }),
          "data-testid": "chevron-" + item.id,
          onClick: onChevronClick,
        })}
      {!isHome &&
        (isFocused
          ? icons.arrow({
              className: cls.unfocusArrow + " " + cls.icon,
              "data-testid": "unfocus-" + item.id,
              onClick: (e) => {
                e.stopPropagation();
                actions.unfocus();
              },
            })
          : viewItemIcon(item))}

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
          className: cls.rowMenuIcon + " " + cls.icon,
          "data-testid": "menu-" + item.id,
        })}
      </button>
    </div>
  );
};

const viewItemIcon = (item: Item) => {
  return items.isVideo(item)
    ? icons.play({
        className: cls.icon + " " + cls.rowIcon + " " + cls.sidebarVideoIcon,
        "data-testid": "circle-" + item.id,
        onClick: (e) => {
          e.stopPropagation();
          actions.playVideo(item.id);
        },
      })
    : items.isChannel(item)
    ? icons.circle({
        className: cls.icon + " " + cls.rowIcon + " " + cls.sidebarChannelIcon,
        "data-testid": "circle-" + item.id,
        onClick: (e) => {
          e.stopPropagation();
          actions.focusItem(item.id);
        },
      })
    : items.isPlaylist(item)
    ? icons.circle({
        className: cls.icon + " " + cls.rowIcon + " " + cls.sidebarPlaylistIcon,
        "data-testid": "circle-" + item.id,
        onClick: (e) => {
          e.stopPropagation();
          actions.focusItem(item.id);
        },
      })
    : icons.circle({
        className: cls.icon + " " + cls.rowIcon + " " + cls.sidebarFolderIcon,
        "data-testid": "circle-" + item.id,
        onClick: (e) => {
          e.stopPropagation();
          actions.focusItem(item.id);
        },
      });
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
      onClick={(e) => e.stopPropagation()}
    />
  );
};

const ROW_HEIGHT = 27;
css.class(cls.row, {
  userSelect: "none",
  display: "flex",
  alignItems: "center",
  position: "relative",
  height: ROW_HEIGHT,
  cursor: "pointer",
  // fontWeight: 300,
});
css.hover(cls.row, {
  backgroundColor: colors.sidebarRowHover,
});

css.parentChild(cls.appDuringItemDrag, cls.row, {
  backgroundColor: "transparent",
  cursor: "inherit",
});

css.class2(cls.row, cls.rowSelected, {
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
  fontWeight: 400,
  fontSize: 22,
  paddingLeft: 8,
});

css.class(cls.icon, {
  cursor: "pointer",
  transition: "transform 150ms ease-in",
  color: colors.iconRegular,
});

css.parentChild(cls.appDuringItemDrag, cls.icon, {
  cursor: "inherit",
});

css.hover(cls.icon, {
  transform: "scale(1.4)",
  color: colors.iconHover,
});

css.active(cls.icon, {
  transform: "scale(1.4) translate3d(0, 1px, 0)",
});

css.class(cls.rowIcon, {
  width: 9,
  minWidth: 9,
  height: 9,
  marginRight: 6,
  marginLeft: 4,
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
  transition: "opacity 400ms ease-out, transform 200ms ease-out",
  opacity: 0,
});

css.onParentHover(cls.leftSidebar, cls.rowChevron, {
  opacity: 1,
});

css.class(cls.rowChevronRotated, {
  transform: "rotateZ(90deg)",
});

css.hover(cls.rowChevronRotated, {
  transform: "scale(1.3) rotateZ(90deg)",
});

css.class(cls.sidebarFolderIcon, {
  color: colors.iconRegular,
});

css.class(cls.sidebarVideoIcon, {
  color: colors.iconRegular,
});

css.class(cls.sidebarChannelIcon, {
  color: colors.channelColor,
});
css.hover(cls.sidebarChannelIcon, {
  color: colors.channelColor,
});
css.class(cls.sidebarPlaylistIcon, {
  color: colors.playlistColor,
});
css.hover(cls.sidebarPlaylistIcon, {
  color: colors.playlistColor,
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

css.class3(cls.rowChevron, cls.icon, cls.iconHidden, {
  opacity: 0,
  pointerEvents: "none",
});

export default Row;
