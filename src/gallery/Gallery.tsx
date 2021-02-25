import React from "react";
import LoadingNineDots from "../commonComponents/LoadingNineDots";
import LoadingStripe from "../commonComponents/LoadingStripe";
import DragAvatar from "../dragAndDrop/DragAvatar";
import { cls, css, utils } from "../infra";
import * as items from "../state";
import Card from "./Card";
import * as c from "./constants";

const actions = items.actions;

type GalleryProps = {
  allItems: Items;
  nodeSelected: string;
  itemBeingPlayed: string | undefined;
  dragState: items.DragState | undefined;
};

class Gallery extends React.PureComponent<GalleryProps> {
  galleryRef = React.createRef<HTMLDivElement>();
  state = {
    columnsCount: 0,
  };

  componentDidMount() {
    this.updateColumnsCount();
    window.addEventListener("resize", this.updateColumnsCount);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnsCount);
  }

  updateColumnsCount = () => {
    const newCols = this.getColsCount();
    if (newCols !== this.state.columnsCount)
      this.setState({ columnsCount: newCols });
  };

  getColsCount = () => {
    const galleryRef = this.galleryRef.current;
    if (galleryRef) {
      return Math.max(
        1,
        Math.round(
          (galleryRef.clientWidth - c.GALLERY_GAP) / (320 + c.GALLERY_GAP)
        )
      );
    }
    return 0;
  };

  onGalleryScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = this.props.allItems[this.props.nodeSelected];
    if (
      utils.getScrollDistanceFromBottom(e.currentTarget) < 5 &&
      items.hasNextPage(item)
    ) {
      actions.loadItem(item);
    }
  };

  renderGalleryColumns = () => {
    const { columnsCount } = this.state;
    //awaiting component did mount to set columns count based on gallery ref
    if (columnsCount == 0) return null;

    return utils.generateNumbers(columnsCount).map((rowNumber) => {
      const { allItems, nodeSelected, dragState } = this.props;
      return (
        <div
          className={cls.galleryColumn}
          key={"col-" + rowNumber}
          onMouseMove={
            dragState && dragState.type === "draggingItem"
              ? (e) =>
                  DragAvatar.mouseMoveOverGalleryColumnDuringDrag(
                    e,
                    items.getChildren(nodeSelected, allItems),
                    dragState
                  )
              : undefined
          }
        >
          {items
            .getChildren(this.props.nodeSelected, this.props.allItems)
            .filter((_, index) => index % columnsCount == rowNumber)
            .map((item) => (
              <Card
                key={item.id}
                item={item}
                allItems={this.props.allItems}
                itemIdBeingPlayed={this.props.itemBeingPlayed}
                dragState={this.props.dragState}
              />
            ))}
        </div>
      );
    });
  };
  render() {
    const { allItems, nodeSelected } = this.props;
    const isLoading = items.isLoadingAnything(allItems[nodeSelected]);
    const isLoadingNextPage = items.isLoadingNextPage(allItems[nodeSelected]);
    return (
      <div className={cls.gallery}>
        <div
          className={cls.galleryScrollArea + " " + cls.overlay}
          onScroll={this.onGalleryScroll}
        >
          <div className={cls.galleryColumnContainer} ref={this.galleryRef}>
            {isLoading && !isLoadingNextPage ? (
              <LoadingNineDots />
            ) : (
              this.renderGalleryColumns()
            )}
          </div>
        </div>
        <LoadingStripe isActive={isLoadingNextPage} />
      </div>
    );
  }
}

css.class(cls.gallery, {
  position: "relative",
  userSelect: "none",
});

css.class(cls.galleryScrollArea, {
  overflowY: "overlay" as any,
});
css.text(css.styles.cssTextForScrollBar(cls.galleryScrollArea, { width: 8 }));

css.class(cls.galleryColumnContainer, {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  minHeight: "100%",
});

css.class(cls.galleryColumn, {
  flex: 1,
});

export default Gallery;
