import React, { useReducer } from "react";
import { cls, css, utils, anim, CollapsibleContainer } from "./infra";
import initialItems from "./initialItems";
import * as items from "./items";

function App() {
  const [state, dispatch] = React.useReducer(items.reducer, initialItems);
  items.setGlobalDispatch(dispatch);
  return (
    <>
      <Row
        item={state.HOME}
        level={0}
        onClick={() => undefined}
        isRoot
        isFocused
      />
      {state.HOME.children.map((id) => (
        <RowWithChildren key={id} level={1} item={state[id]} allItems={state} />
      ))}
    </>
  );
}

css.class(cls.rowChevron, {
  transition: "transform 150ms ease-in",
});
css.class(cls.rotated, {
  transform: "rotateZ(90deg)",
});

type Props = { level: number; item: Item; allItems: Items };

class RowWithChildren extends React.Component<Props> {
  renderChildren = (ids: string[], level: number) => (
    <CollapsibleContainer isOpen={!!this.props.item.isOpen}>
      {() => (
        <>
          {ids.map((id) => (
            <RowWithChildren
              key={id}
              level={level + 1}
              item={this.props.allItems[id]}
              allItems={this.props.allItems}
            />
          ))}
        </>
      )}
    </CollapsibleContainer>
  );

  onRowClick = () => items.actions.toggleItemInSidebar(this.props.item);

  renderRow = (item: Item, level: number) => (
    <Row item={item} level={level} onClick={this.onRowClick} />
  );

  render() {
    const { item, level } = this.props;
    return (
      <>
        {this.renderRow(item, level)}
        {this.renderChildren(item.children, level)}
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
  isRoot?: boolean;
  isFocused?: boolean;
  onClick: () => void;
};
const Row = ({ item, isRoot, isFocused, level, onClick }: RowProps) => (
  <div
    className={utils.cn({
      [cls.row]: true,
      [cls.rowFocused]: isFocused,
    })}
    style={{ paddingLeft: level * 20 }}
    onClick={onClick}
  >
    {!isRoot && (
      <div
        className={utils.cn({
          [cls.rotated]: item.isOpen,
          [cls.rowChevron]: true,
        })}
      >
        {">"}
      </div>
    )}
    {item.title}
    {!isRoot && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log("focus node");
        }}
      >
        f
      </button>
    )}
  </div>
);
export default App;
