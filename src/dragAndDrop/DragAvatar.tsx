import { GALLERY_GAP } from "../gallery/constants";
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

  static mouseMoveOverSidebarRowDuringDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    item: Item,
    level: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isOnTheSecondHalf = e.clientY >= rect.top + rect.height / 2;
    const itemInsideBoundary = 32 + level * PADDING_PER_LEVEL;
    const isInside = e.clientX > itemInsideBoundary;

    const visualPaddingToANonZeroLevel = 8;
    const itemPosition =
      isInside && isOnTheSecondHalf
        ? "inside"
        : isOnTheSecondHalf
        ? "after"
        : "before";

    const targetLevel = itemPosition === "inside" ? level + 1 : level;
    const left =
      targetLevel == 0
        ? 0
        : visualPaddingToANonZeroLevel + targetLevel * PADDING_PER_LEVEL;

    const top =
      itemPosition == "before"
        ? rect.top - DRAG_DESTINATION_HEIGHT_HALF
        : rect.bottom - DRAG_DESTINATION_HEIGHT_HALF;
    items.actions.setDragDestination({
      itemPosition,
      itemUnderId: item.id,
      left,
      width: rect.width - left,
      top,
    });
  };

  static mouseMoveOverGallerySubitemDuringDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    item: Item
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isOnTheSecondHalf = e.clientY >= rect.top + rect.height / 2;
    const itemPosition = isOnTheSecondHalf ? "after" : "before";
    const top =
      itemPosition == "before"
        ? rect.top - DRAG_DESTINATION_HEIGHT_HALF
        : rect.bottom - DRAG_DESTINATION_HEIGHT_HALF;
    items.actions.setDragDestination({
      itemPosition: isOnTheSecondHalf ? "after" : "before",
      itemUnderId: item.id,
      left: rect.left,
      width: rect.width,
      top,
    });
    //marks such that gallery column mouse move won't handle this event
    //I can't use stop propagation here, because I'm processing this event and the document level
    e.detail = 1;
  };

  static findDragDestinationPosition = (
    itemsInGallery: Item[],
    dragState: items.DragState
  ): {
    top: number;
    left: number;
    width: number;
  } => {
    const column = Array.from(
      document.getElementsByClassName(cls.galleryColumn)
    );

    let lastColumnIndex = itemsInGallery.length % column.length;
    if (lastColumnIndex < 0) lastColumnIndex = column.length - 1;
    const isItemBeingDraggeedInGallery =
      itemsInGallery.map((i) => i.id).indexOf(dragState.itemId) >= 0;

    if (isItemBeingDraggeedInGallery) {
      lastColumnIndex -= 1;
      if (lastColumnIndex < 0) lastColumnIndex = 0;
    }
    const columnWithLastItem = column[lastColumnIndex];
    if (columnWithLastItem.hasChildNodes()) {
      const lastCard = columnWithLastItem.lastChild?.lastChild as HTMLElement;
      const rect = lastCard.getBoundingClientRect();
      return {
        left: rect.left,
        width: rect.width,
        top: isItemBeingDraggeedInGallery
          ? rect.top - GALLERY_GAP / 2 + DRAG_DESTINATION_HEIGHT_HALF
          : rect.bottom + GALLERY_GAP / 2 - DRAG_DESTINATION_HEIGHT_HALF,
      };
    }
    return {
      left: 500,
      width: 500,
      top: 500,
    };
  };
  static mouseMoveOverGalleryColumnDuringDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    itemsInGallery: Item[],
    dragState: items.DragState
  ) => {
    if (e.detail == 1) return;
    const position = DragAvatar.findDragDestinationPosition(
      itemsInGallery,
      dragState
    );
    items.actions.setDragDestination({
      itemPosition: "after",
      itemUnderId: itemsInGallery[itemsInGallery.length - 1].id,
      ...position,
    });
  };

  static mouseMoveOverCardDuringDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    item: Item
  ) => {
    if (e.detail == 1) return;
    e.detail = 1;
    const card = e.currentTarget;
    if (card && card.lastChild) {
      //getting card from the card-container
      const rect = (card.lastChild as Element).getBoundingClientRect();
      items.actions.setDragDestination({
        itemPosition: "instead",
        itemUnderId: item.id,
        left: rect.left,
        width: rect.width,
        top: rect.top - GALLERY_GAP / 2 + DRAG_DESTINATION_HEIGHT_HALF,
      });
    }
  };

  renderDragDestination = (dragDestination: items.DragDestination) => {
    return (
      <div
        data-testid="drag-destination"
        className={cls.dragDesignation}
        style={{
          left: dragDestination.left,
          top: dragDestination.top,
          width: dragDestination.width,
        }}
      />
    );
  };

  renderDragDestinationHelperText = (
    dragDestination: items.DragDestination,
    dragState: items.DragState
  ) => {
    const arrow =
      dragDestination.itemPosition == "inside"
        ? "⤷"
        : dragDestination.itemPosition == "before"
        ? "↑"
        : "↓";
    const itemBeingDraggedPath = items.hasItemInPath(
      dragDestination.itemUnderId,
      dragState.itemId,
      this.props.state.items
    );

    const message = itemBeingDraggedPath ? (
      <>
        × Can't move{" "}
        <span style={{ fontWeight: "bold" }}>
          {this.props.state.items[dragState.itemId].title}
        </span>{" "}
        to it's child.
      </>
    ) : (
      `${arrow} Move ${dragDestination.itemPosition} `
    );
    return (
      <div
        data-testid="drag-destination-info"
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
        <span
          style={{
            color: itemBeingDraggedPath ? colors.danger : colors.primary,
          }}
        >
          {message}
        </span>
        {!itemBeingDraggedPath && (
          <span style={{ fontWeight: "bold" }}>
            {this.props.state.items[dragDestination.itemUnderId].title}
          </span>
        )}
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
            this.renderDragDestinationHelperText(dragDestination, dragState)}
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
const DRAG_DESTINATION_HEIGHT = 4;
const DRAG_DESTINATION_HEIGHT_HALF = Math.floor(DRAG_DESTINATION_HEIGHT / 2);

css.class(cls.dragDesignation, {
  position: "fixed",
  height: DRAG_DESTINATION_HEIGHT,
  backgroundColor: colors.dragDestination,
  pointerEvents: "none",
});

export default DragAvatar;
