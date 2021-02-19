import React from "react";
import { cls, css, utils } from "../infra";
import * as items from "../items";
import Card from "./Card";
import * as c from "./constants";

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
    return (
      <div className={cls.galleryColumnContainer} ref={this.galleryRef}>
        {this.renderGalleryColumns()}
      </div>
    );
  }
}

css.class(cls.gallery, {
  overflowY: "overlay" as any,
});
css.text(css.styles.cssTextForScrollBar(cls.gallery, { width: 8 }));

css.class(cls.galleryColumnContainer, {
  paddingTop: c.GALLERY_GAP,
  paddingRight: c.GALLERY_GAP,
  minHeight: 1,
  display: "flex",
  flexDirection: "row",
});

css.class(cls.galleryColumn, {
  flex: 1,
  marginLeft: c.GALLERY_GAP,
});

export default Gallery;
