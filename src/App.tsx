import React, { useEffect } from "react";
import ContextMenuView from "./commonComponents/ContextMenu";
import Gallery from "./gallery/Gallery";
import Header from "./Header";
import { tIds, css, colors, cls, utils } from "./infra";
import initialItems from "./initialItems";
import * as items from "./state";
import LeftSidebar from "./sidebars/LeftSidebar";

function App() {
  const initialState: items.RootState = {
    ...items.initialState,
    items: {
      ...initialItems,
      SEARCH: {
        type: "search",
        children: [],
        id: "SEARCH",
        searchTerm: "",
        title: "Search",
      },
    },
  };
  const [state, dispatch] = React.useReducer(items.reducer, initialState);
  items.setGlobalDispatch(dispatch);
  const galleryRef = React.createRef<Gallery>();
  const onSidebarResize = () => {
    if (galleryRef.current) galleryRef.current.updateColumnsCount();
  };
  useEffect(() => {
    const sidebarTransitionChange = 200;
    setTimeout(() => {
      onSidebarResize();
      //wait for animation to finish
    }, sidebarTransitionChange);
  }, [state.uiOptions.isLeftSidebarVisible]);
  return (
    <>
      <div
        className={utils.cn({
          [cls.app]: true,
          [cls.appDuringDrag]: state.uiState.isMouseDownOnAdjuster,
        })}
      >
        <LeftSidebar state={state} onResize={onSidebarResize} />
        <div className={cls.topbar}>
          <Header
            uiOptions={state.uiOptions}
            searchNode={state.items["SEARCH"] as SearchContainer}
          />
        </div>
        <Gallery
          ref={galleryRef}
          allItems={state.items}
          nodeSelected={state.uiOptions.selectedNode}
        />

        <div className={cls.player}>Player</div>
      </div>
      <ContextMenuView options={state.uiState.contextMenu} />
    </>
  );
}

css.tag("body", {
  backgroundColor: colors.menu,
  color: colors.textRegular,
});
css.class(cls.appDuringDrag, {
  userSelect: "none",
});
css.class(cls.app, {
  height: "100vh",
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  gridTemplateColumns: "auto 1fr auto",
  gridTemplateAreas: `
    "header header header"
    "leftSidebar gallery rightSidebar"
    "player player player"
  `,
});
css.class(cls.topbar, {
  gridArea: "header",
  height: 60,
});
css.class(cls.gallery, {
  gridArea: "gallery",
  backgroundColor: colors.gallery,
});

css.class(cls.player, {
  gridArea: "player",
  height: 40,
});
css.class(cls.rightSidebar, {
  gridArea: "rightSidebar",
});
export default App;
