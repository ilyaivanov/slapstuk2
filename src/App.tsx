import React, { useReducer } from "react";
import * as items from "./items";

function App() {
  const [state, dispatch] = React.useReducer(items.reducer, items.initialItems);
  items.setGlobalDispatch(dispatch);
  return <Row item={state.HOME} />;
}

const Row = ({ item }: { item: items.Item }) => {
  return (
    <div onClick={() => items.actions.rename("HOME", Math.random() + "")}>
      {item.title}
    </div>
  );
};

class TextInfoView extends React.Component<any> {
  ref = React.createRef<HTMLDivElement>();

  collapse = () => {
    if (this.ref.current)
      this.ref.current.animate(
        [
          {
            height: this.ref.current.clientHeight + "px",
            opacity: 1,
          },
          { height: "0px", opacity: 0 },
        ],
        {
          duration: 400,
        }
      );
  };
  componentDidMount() {
    if (this.ref.current)
      this.ref.current.animate(
        [
          { height: "0px", opacity: 0 },
          {
            height: this.ref.current.clientHeight + "px",
            opacity: 1,
          },
        ],
        {
          duration: 400,
        }
      );
  }
  render() {
    const info = this.props.info;
    return (
      <div
        ref={this.ref}
        style={{
          fontSize: info.fontSize,
          backgroundColor: info.color,
          overflow: "hidden",
        }}
      >
        {info.text}
      </div>
    );
  }
}

export default App;
