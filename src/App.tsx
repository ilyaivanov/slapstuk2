import React from "react";
import ContextMenuView from "./ContextMenu";
import { cls, colors, css, icons, tIds, utils } from "./infra";
import initialItems from "./initialItems";
import * as items from "./items";
import AppLayout from "./Layout";
import Row, { getPaddingForLevel } from "./sidebar/Row";

function App() {
  const initialState: items.RootState = {
    items: initialItems,
    uiOptions: {
      focusedNode: "HOME",
      selectedNode: "HOME",
      leftSidebarWidth: 300,
      isLeftSidebarVisible: true,
    },
    uiState: {
      isMouseDownOnAdjuster: false,
    },
  };
  const [state, dispatch] = React.useReducer(items.reducer, initialState);
  items.setGlobalDispatch(dispatch);
  const allItems = state.items;
  const focusedNode = allItems[state.uiOptions.focusedNode];
  return (
    <>
      <AppLayout
        state={state}
        gallery={<div>{allItems[state.uiOptions.selectedNode].title}</div>}
        topbar={
          <div>
            <button
              data-testid={tIds.toggleSidebar}
              onClick={() =>
                items.actions.assignUiOptions({
                  isLeftSidebarVisible: !state.uiOptions.isLeftSidebarVisible,
                })
              }
            >
              left
            </button>
          </div>
        }
        sidebar={
          <>
            <div className={cls.sidebarHeader}>
              {icons.folderPlus({
                className: cls.rowIcon + " " + cls.createFolderIcon,
                // onClick:
              })}
            </div>
            <div className={cls.sidebarScrollArea}>
              <RowWithChildren
                item={focusedNode}
                allItems={allItems}
                level={-1}
                focusedNodeId={state.uiOptions.selectedNode}
                renameState={state.uiState.renameState}
                isRootItem
              />
            </div>
            <SidebarWidthAdjuster
              isMouseDown={state.uiState.isMouseDownOnAdjuster}
            />
          </>
        }
      />
      <ContextMenuView options={state.uiState.contextMenu} />
    </>
  );
}

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

css.class(cls.createFolderIcon, {
  height: 18,
});

css.class(cls.sidebarHeader, {
  display: "flex",
  justifyContent: "flex-end",
  paddingRight: 5,
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
      {this.props.item.children.map((id) => (
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

  onRowClick = () => {
    items.actions.toggleItemInSidebar(this.props.item);
    if (this.props.item.children.length === 0 && !this.props.item.isLoading) {
      items.actions.startLoading(this.props.item);
    }
  };

  renderRow = (item: Item, level: number) => (
    <Row
      item={item}
      level={level}
      isFocused={this.props.isRootItem}
      isSelected={item.id === this.props.focusedNodeId}
      renameState={this.props.renameState}
      onClick={this.onRowClick}
    />
  );

  render() {
    const { item, level, isRootItem } = this.props;
    return (
      <>
        {this.renderRow(item, level)}
        {(item.isOpen || isRootItem) &&
          (item.isLoading ? this.renderLoading() : this.renderChildren())}
      </>
    );
  }
}

export default App;
