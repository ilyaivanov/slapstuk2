import React, { useReducer } from "react";
import { cls, css, utils, anim, CollapsibleContainer } from "./infra";
import initialItems from "./initialItems";
import * as items from "./items";

function App() {
  const initialState: items.RootState = {
    items: initialItems,
    uiOptions: {
      focusedNode: "HOME",
    },
  };
  const [state, dispatch] = React.useReducer(items.reducer, initialState);
  items.setGlobalDispatch(dispatch);
  const allItems = state.items;
  const focusedNode = allItems[state.uiOptions.focusedNode];
  return (
    <>
      <div style={{ height: 100, backgroundColor: "lightGrey" }}>header</div>
      <div className={cls.sidebar}>
        <RowWithChildren
          item={focusedNode}
          allItems={allItems}
          level={0}
          isRootItem
        />
      </div>
    </>
  );
}

css.class(cls.rowChevron, {
  transition: "transform 150ms ease-in",
});
css.class(cls.rotated, {
  transform: "rotateZ(90deg)",
});

type Props = {
  level: number;
  item: Item;
  allItems: Items;
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
        />
      ))}
    </div>
  );

  renderLoading = () => (
    <div
      data-testid={"loading-" + this.props.item.id}
      style={{ paddingLeft: (this.props.level + 1) * 20 }}
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

css.class(cls.row, {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
});

css.class(cls.rowFocused, {
  fontWeight: "bold",
  fontSize: 20,
});

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
      style={{ paddingLeft: level * 20 }}
      onClick={onClick}
    >
      {!isHome && isFocused && (
        <button
          data-testid={"unfocus-" + item.id}
          onClick={(e) => {
            e.stopPropagation();
            items.actions.unfocus();
          }}
        >
          {"<-"}
        </button>
      )}
      {!isHome && (
        <div
          data-testid={"chevron-" + item.id}
          className={utils.cn({
            [cls.rotated]: item.isOpen,
            [cls.rowChevron]: true,
          })}
        >
          {">"}
        </div>
      )}
      {item.title}
      {!isHome && (
        <button
          data-testid={"focus-" + item.id}
          onClick={(e) => {
            e.stopPropagation();
            items.actions.focusItem(item);
          }}
        >
          f
        </button>
      )}
    </div>
  );
};
export default App;
