import React from "react";
import { cls, colors, css, icons, tIds } from "../infra";
import * as items from "../state";
import Row, { getPaddingForLevel } from "../sidebars/Row";

const LeftSidebar = ({ state }: { state: items.RootState }) => (
  <div
    className={cls.leftSidebar}
    style={{
      width: state.uiOptions.leftSidebarWidth,
      marginLeft: state.uiOptions.isLeftSidebarVisible
        ? 0
        : -state.uiOptions.leftSidebarWidth,
    }}
  >
    <div className={cls.sidebarHeader}>
      {icons.folderPlus({
        "data-testid": "sidebarCreateFolder",
        className: cls.icon + " " + cls.createFolderIcon,
        onClick: () => items.actions.addNewForder(),
      })}
    </div>
    <div className={cls.sidebarScrollArea}>
      <RowWithChildren
        item={state.items[state.uiOptions.focusedNode]}
        allItems={state.items}
        level={-1}
        focusedNodeId={state.uiOptions.selectedNode}
        renameState={state.uiState.renameState}
        isRootItem
      />
    </div>
    <SidebarWidthAdjuster isMouseDown={state.uiState.isMouseDownOnAdjuster} />
  </div>
);

type SidebarWidthAdjusterProps = {
  isMouseDown: boolean;
};
class SidebarWidthAdjuster extends React.PureComponent<SidebarWidthAdjusterProps> {
  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.props.isMouseDown) items.actions.setSidebarWidth(e.clientX);
  };

  onMouseUp = () =>
    items.actions.assignUiState({
      isMouseDownOnAdjuster: false,
    });

  onMouseDown = () =>
    items.actions.assignUiState({
      isMouseDownOnAdjuster: true,
    });

  render() {
    return (
      <div
        className={cls.sidebarWidthAdjuster}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}
css.class(cls.leftSidebar, {
  gridArea: "leftSidebar",
  transition: "margin-left 200ms ease-out",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

css.class(cls.createFolderIcon, {
  height: 16,
});

css.class(cls.sidebarHeader, {
  display: "flex",
  justifyContent: "flex-end",
  padding: "2px 5px",
});

css.class(cls.sidebarWidthAdjuster, {
  position: "absolute",
  right: -1,
  width: 3,
  top: 0,
  bottom: 0,
  cursor: "col-resize",
  transition: "background-color 200ms ease-out",
});

css.hover(cls.sidebarWidthAdjuster, {
  backgroundColor: colors.primary,
});

css.class(cls.sidebarScrollArea, {
  overflowY: "auto",
});

css.text(css.styles.cssTextForScrollBar(cls.sidebarScrollArea, { width: 8 }));

type Props = {
  level: number;
  item: Item;
  allItems: Items;
  renameState: items.RenameState | undefined;
  focusedNodeId: string;
  isRootItem?: boolean;
};

class RowWithChildren extends React.PureComponent<Props> {
  renderChildren = () => (
    <div data-testid={"children-" + this.props.item.id}>
      {items.isContainer(this.props.item) &&
        this.props.item.children.map((id) => (
          <RowWithChildren
            key={id}
            level={this.props.level + 1}
            item={this.props.allItems[id]}
            allItems={this.props.allItems}
            focusedNodeId={this.props.focusedNodeId}
            renameState={this.props.renameState}
          />
        ))}
    </div>
  );

  renderLoading = () => (
    <div
      data-testid={"loading-" + this.props.item.id}
      style={{ paddingLeft: getPaddingForLevel(this.props.level + 2) }}
    >
      Loading...
    </div>
  );

  onChevronClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    if (items.isContainer(this.props.item)) {
      items.actions.toggleItemInSidebar(this.props.item);
      const { item } = this.props;
      if (items.isNeedsToBeLoaded(item)) {
        items.actions.loadItem(this.props.item);
      }
    }
  };

  renderRow = (item: Item, level: number) => (
    <Row
      item={item}
      level={level}
      isFocused={this.props.isRootItem}
      isSelected={item.id === this.props.focusedNodeId}
      renameState={this.props.renameState}
      onChevronClick={this.onChevronClick}
    />
  );

  render() {
    const { item, level, isRootItem } = this.props;
    return (
      <>
        {this.renderRow(item, level)}
        {(items.isOpenAtSidebar(item) || isRootItem) &&
          (items.isLoading(item)
            ? this.renderLoading()
            : this.renderChildren())}
      </>
    );
  }
}

export default LeftSidebar;
