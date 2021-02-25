import React, { useEffect } from "react";
import { utils } from "../infra";
import CollapsibleContainer from "../infra/CollapsibleContainer";

const Animations = () => {
  const [card1Open, setcard1open] = React.useState(false);
  const [text, setText] = React.useState(getRandomText());

  const render = React.useMemo(() => () => text, [text]);
  return (
    <div>
      <div style={{ width: 300 }}>
        <button onClick={() => setcard1open(!card1Open)}>toggle</button>
        <button onClick={() => setText(getRandomText())}>update</button>
        <CollapsibleContainer
          isOpen={card1Open}
          style={{ backgroundColor: "lightGrey" }}
        >
          {render}
        </CollapsibleContainer>
      </div>
    </div>
  );
};

export default Animations;
const getRandomText = () => {
  const randomLength = Math.floor(Math.random() * randomSample.length - 1);
  return randomSample.substr(0, randomLength);
};
const randomSample = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
perspiciatis, suscipit enim odit fugit dolore amet. Quia, minima illo.
Perspiciatis velit ea illum autem quia totam labore, nulla impedit
ducimus. Lorem ipsum dolor sit amet consectetur adipisicing elit.
Commodi perspiciatis, suscipit enim odit fugit dolore amet. Quia,
minima illo. Perspiciatis velit ea illum autem quia totam labore,
nulla impedit ducimus. Lorem ipsum dolor sit amet consectetur
adipisicing elit. Commodi perspiciatis, suscipit enim odit fugit
dolore amet. Quia, minima illo. Perspiciatis velit ea illum autem quia
totam labore, nulla impedit ducimus. Lorem ipsum dolor sit amet
consectetur adipisicing elit. Commodi perspiciatis, suscipit enim odit
fugit dolore amet. Quia, minima illo. Perspiciatis velit ea illum
autem quia totam labore, nulla impedit ducimus. 
Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
perspiciatis, suscipit enim odit fugit dolore amet. Quia, minima illo.
Perspiciatis velit ea illum autem quia totam labore, nulla impedit
ducimus. Lorem ipsum dolor sit amet consectetur adipisicing elit.
Commodi perspiciatis, suscipit enim odit fugit dolore amet. Quia,
minima illo. Perspiciatis velit ea illum autem quia totam labore,
nulla impedit ducimus. Lorem ipsum dolor sit amet consectetur
adipisicing elit. Commodi perspiciatis, suscipit enim odit fugit
dolore amet. Quia, minima illo. Perspiciatis velit ea illum autem quia
totam labore, nulla impedit ducimus. Lorem ipsum dolor sit amet
consectetur adipisicing elit. Commodi perspiciatis, suscipit enim odit
fugit dolore amet. Quia, minima illo. Perspiciatis velit ea illum
autem quia totam labore, nulla impedit ducimus.`;
