import React from "react";
import LoadingNineDots from "../commonComponents/LoadingNineDots";
import LoadingStripe from "../commonComponents/LoadingStripe";
import { cls, colors, css, utils } from "../infra";
import * as items from "../state";
import Card from "./Card";
import * as c from "./constants";

const actions = items.actions;

type GalleryProps = {
  allItems: Items;
  nodeSelected: string;
};

class Gallery extends React.Component<GalleryProps> {
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

    return utils.generateNumbers(columnsCount).map((rowNumber) => (
      <div className={cls.galleryColumn} key={"col-" + rowNumber}>
        {items
          .getChildren(this.props.nodeSelected, this.props.allItems)
          .filter((_, index) => index % columnsCount == rowNumber)
          .map((item) => (
            <Card key={item.id} item={item} allItems={this.props.allItems} />
          ))}
      </div>
    ));
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
});

css.class(cls.galleryScrollArea, {
  overflowY: "overlay" as any,
});
css.text(css.styles.cssTextForScrollBar(cls.galleryScrollArea, { width: 8 }));

css.class(cls.galleryColumnContainer, {
  paddingTop: c.GALLERY_GAP,
  paddingRight: c.GALLERY_GAP,
  display: "flex",
  flexDirection: "row",
});

css.class(cls.galleryColumn, {
  flex: 1,
  marginLeft: c.GALLERY_GAP,
});

export default Gallery;
