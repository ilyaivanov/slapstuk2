import React from "react";
import { cls, colors, css, utils, zIndexes } from "../infra";
import { distance } from "../infra/utils";
import { PADDING_PER_LEVEL } from "../sidebars/Row";
import * as items from "../state";

type DndListenerProps = {
  state: items.RootState;
};

class DragAvatar extends React.Component<DndListenerProps> {
  state = {
    mousePositionDuringDrag: {
      x: 0,
      y: 0,
    },
  };
  componentDidUpdate(prevProps: DndListenerProps) {
    //I don't want to always listen to mouse drag events
    if (!prevProps.state.dragState && this.props.state.dragState) {
      document.addEventListener("mousemove", this.onMouseMoveDuringDrag);
      document.addEventListener("mouseup", this.onMouseUp);
    } else if (prevProps.state.dragState && !this.props.state.dragState) {
      document.removeEventListener("mousemove", this.onMouseMoveDuringDrag);
      document.removeEventListener("mouseup", this.onMouseUp);
    }

    //used during development
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.removeEventListener("mousemove", this.onMouseMoveDuringDrag);
        document.removeEventListener("mouseup", this.onMouseUp);
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMoveDuringDrag);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  onMouseUp = () => {
    items.actions.completeDnd();
  };

  onMouseMoveDuringDrag = (e: MouseEvent) => {
    const { state } = this.props;
    const { dragState } = state;
    if (!dragState) return;
    if (dragState.type == "mouseDownNoDrag") {
      const currentPosition: Point = { x: e.clientX, y: e.clientY };
      const distanceTraveledFromMouseDown = distance(
        currentPosition,
        dragState.point
      );
      if (distanceTraveledFromMouseDown > 6) {
        items.actions.startDragging(dragState.itemId);
        this.updateCurrentAvatarPosition(e);
      }
    } else if (dragState.type == "draggingItem") {
      this.updateCurrentAvatarPosition(e);
    }
  };

  updateCurrentAvatarPosition = (e: MouseEvent) =>
    this.setState({ mousePositionDuringDrag: { x: e.clientX, y: e.clientY } });

  renderDragDestination = (dragDestination: items.DragDestination) => {
    const rect = dragDestination.itemUnderRect;

    const targetLevel =
      dragDestination.itemPosition == "inside"
        ? dragDestination.itemUnderLevel + 1
        : dragDestination.itemUnderLevel;
    const visualPaddingToANonZeroLevel = 8;
    const left =
      targetLevel == 0
        ? 0
        : visualPaddingToANonZeroLevel + targetLevel * PADDING_PER_LEVEL;
    return (
      <div
        data-testid="drag-destination"
        className={cls.dragDesignation}
        style={{
          left: left,
          top:
            //inside same as after, just left is different
            dragDestination.itemPosition == "before"
              ? rect.top - DRAG_DESTINATION_HEIGHT_HALF
              : rect.bottom - DRAG_DESTINATION_HEIGHT_HALF,
          width: rect.width - left,
        }}
      />
    );
  };

  renderDragDestinationHelperText = (
    dragDestination: items.DragDestination
  ) => {
    const arrow =
      dragDestination.itemPosition == "inside"
        ? "↘"
        : dragDestination.itemPosition == "before"
        ? "↑"
        : "↓";
    return (
      <div
        style={{
          position: "absolute",
          top: avatarCircleSize + 2,
          left: avatarCircleSize + 2,
          color: "black",
          opacity: 0.9,
          background: "linear-gradient(white, #DFDFDF)",
          padding: "2px 4px",
          fontSize: 14,
          border: "1px solid black",
          maxWidth: 300,
          borderRadius: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <span style={{ color: colors.primary }}>
          {arrow} Move {dragDestination.itemPosition}{" "}
        </span>
        <span style={{ fontWeight: "bold" }}>
          {this.props.state.items[dragDestination.itemUnderId].title}
        </span>
      </div>
    );
  };

  render() {
    const { state } = this.props;
    const { dragState, dragDestination } = state;
    const { mousePositionDuringDrag } = this.state;
    let avatar =
      dragState?.type === "draggingItem" && mousePositionDuringDrag ? (
        <div
          data-testid="drag-avatar"
          className={cls.dragAvatar}
          style={{
            left: mousePositionDuringDrag.x - avatarCircleSize / 2,
            top: mousePositionDuringDrag.y - avatarCircleSize / 2,
          }}
        >
          {dragDestination &&
            this.renderDragDestinationHelperText(dragDestination)}
        </div>
      ) : null;
    let dragDestinationView = dragDestination
      ? this.renderDragDestination(dragDestination)
      : null;
    return (
      <>
        {avatar}
        {dragDestinationView}
      </>
    );
  }
}
const avatarCircleSize = 18;
css.class(cls.dragAvatar, {
  position: "fixed",
  pointerEvents: "none",
  backgroundColor: colors.iconRegular,

  zIndex: zIndexes.dragAvatar,

  //circle
  height: avatarCircleSize,
  width: avatarCircleSize,
  borderRadius: avatarCircleSize / 2,

  //Text
  //   padding: "2px 6px",
  //   fontWeight: 300,
});
const DRAG_DESTINATION_HEIGHT = 3;
const DRAG_DESTINATION_HEIGHT_HALF = Math.floor(DRAG_DESTINATION_HEIGHT / 2);

css.class(cls.dragDesignation, {
  position: "fixed",
  height: DRAG_DESTINATION_HEIGHT,
  backgroundColor: "red",
  pointerEvents: "none",
});

export default DragAvatar;
