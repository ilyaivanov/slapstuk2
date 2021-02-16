import React, { useReducer } from "react";
import { cls, css, utils, anim } from "./infra";
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

css.class(cls.childrenContainer, {
  overflow: "hidden",
});

css.class(cls.rowChevron, {
  transition: "transform 150ms ease-in",
});
css.class(cls.rotated, {
  transform: "rotateZ(90deg)",
});

type Props = { level: number; item: Item; allItems: Items };

class RowWithChildren extends React.Component<Props> {
  childRef = React.createRef<HTMLDivElement>();
  transitionDuration = 200;
  componentDidUpdate(preProps: Props) {
    if (
      !preProps.item.isOpen &&
      this.props.item.isOpen &&
      this.childRef.current
    ) {
      const a = anim.animate(
        this.childRef.current,
        [
          { height: 0, opacity: 0 },
          {
            height: this.childRef.current.clientHeight,
            opacity: 1,
          },
        ],
        {
          duration: this.transitionDuration,
          id: "expanding",
        }
      );
      this.handleAnimationFinish(a);
    }
  }

  renderChildren = (ids: string[], level: number) => (
    <div ref={this.childRef} className={cls.childrenContainer}>
      {ids.map((id) => (
        <RowWithChildren
          level={level + 1}
          key={id}
          item={this.props.allItems[id]}
          allItems={this.props.allItems}
        />
      ))}
    </div>
  );

  revertCurrentAnimations = () => {
    if (this.childRef.current) {
      const animation = anim.getAnimations(this.childRef.current)[0];
      if (animation) {
        animation.id = animation.id == "expanding" ? "collapsing" : "expanding";
        animation.reverse();
        return true;
      }
    }
    return false;
  };

  onRowClick = () => {
    if (this.revertCurrentAnimations()) return;
    const { current } = this.childRef;
    if (current && this.props.item.isOpen) {
      const a = current.animate(
        [
          {
            height: current.clientHeight + "px",
            opacity: 1,
          },
          { height: "0px", opacity: 0 },
        ],
        {
          duration: this.transitionDuration,
          id: "collapsing",
        }
      );
      this.handleAnimationFinish(a);
    } else {
      items.actions.openItemInSidebar(this.props.item);
    }
  };

  handleAnimationFinish = (a: Animation) => {
    a.addEventListener("finish", () => {
      if (a.id == "collapsing")
        items.actions.hideItemInSidebar(this.props.item);
      else items.actions.openItemInSidebar(this.props.item);
    });
  };

  renderRow = (item: Item, level: number) => (
    <Row item={item} level={level} onClick={this.onRowClick} />
  );

  render() {
    const { item, level } = this.props;
    return (
      <>
        {this.renderRow(item, level)}
        {item.isOpen && this.renderChildren(item.children, level)}
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
