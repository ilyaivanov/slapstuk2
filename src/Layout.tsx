import React from "react";
import { cls, colors, css, utils } from "./infra";
import { RootState } from "./items";
type Props = {
  sidebar: React.ReactElement;
  topbar: React.ReactElement;
  gallery: React.ReactElement;
  state: RootState;
};
const AppLayout = ({ sidebar, gallery, topbar, state }: Props) => {
  return (
    <div
      className={utils.cn({
        [cls.app]: true,
        [cls.appDuringDrag]: state.uiState.isMouseDownOnAdjuster,
      })}
    >
      <div
        className={cls.leftSidebar}
        style={{
          width: state.uiOptions.leftSidebarWidth,
          marginLeft: state.uiOptions.isLeftSidebarVisible
            ? 0
            : -state.uiOptions.leftSidebarWidth,
        }}
      >
        {sidebar}
      </div>
      <div className={cls.topbar}>{topbar}</div>
      <div className={cls.gallery}>{gallery}</div>
      <div className={cls.player}>Player</div>
    </div>
  );
};
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

css.class(cls.leftSidebar, {
  gridArea: "leftSidebar",
  transition: "margin-left 200ms ease-out",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});
css.class(cls.player, {
  gridArea: "player",
  height: 40,
});
css.class(cls.rightSidebar, {
  gridArea: "rightSidebar",
});
export default AppLayout;
