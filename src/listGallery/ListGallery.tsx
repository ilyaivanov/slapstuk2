import React from "react";
import { GalleryProps } from "../gallery/Gallery";
import { cls, CollapsibleContainer, colors, css, utils } from "../infra";
import * as c from "../gallery/constants";
import * as items from "../state";
const cl = utils.cn;
const LIST_GAP = 20;

class ListGallery extends React.Component<GalleryProps> {
  galleryRef = React.createRef<HTMLDivElement>();
  renderRow = (item: Item) => {
    const imgSrc = items.getFirstImage(item, this.props.allItems);
    return (
      <div
        className={cl({
          [cls.listTrack]: true,
          [cls.listTrackPlaying]: item.id === this.props.itemBeingPlayed,
        })}
        key={item.id}
        onClick={() => {
          if (items.isContainer(item)) {
            const firstVideo = items.getFirstVideo(item, this.props.allItems);
            if (firstVideo) {
              items.actions.playVideo(firstVideo.id);
            }
          } else items.actions.playVideo(item.id);
        }}
      >
        {imgSrc ? (
          <img src={items.getFirstImage(item, this.props.allItems)} alt="" />
        ) : (
          <div className={cls.listCardEmptyImage}>Empty</div>
        )}

        <span>{item.title}</span>
      </div>
    );
  };

  renderCardContent = (item: Item) => {
    return items.getChildren(item.id, this.props.allItems).map(this.renderRow);
  };

  renderCard = (item: Item) => {
    return (
      <div key={item.id} className={cls.listCard}>
        <div
          onClick={() =>
            items.isContainer(item) && items.actions.toggleItemInGallery(item)
          }
          className={cls.listCardHeader}
        >
          {item.title}
        </div>
        <CollapsibleContainer
          className={cls.listCardChildrenContainer}
          isOpen={items.isOpenAtGallery(item)}
          onWheel={(e) => {
            const target = e.currentTarget;
            //I do not want to scroll gallery when I'm scrolling here
            if (target.scrollHeight > target.clientHeight) e.stopPropagation();
          }}
          heightProperty="flex"
        >
          {() => this.renderCardContent(item)}
        </CollapsibleContainer>
      </div>
    );
  };
  render() {
    const { nodeSelected, allItems } = this.props;
    return (
      <div
        ref={this.galleryRef}
        className={cls.gallery + " " + cls.listGallery}
        onWheel={(e) => {
          if (this.galleryRef.current) {
            this.galleryRef.current.scrollBy({
              left: e.deltaY * 2,
              behavior: "smooth",
            });
          }
        }}
      >
        {items.getChildren(nodeSelected, allItems).map(this.renderCard)}
        {/* this div is a margin for a scroll area in the end */}
        <div style={{ height: "100%", width: 20 }} />
      </div>
    );
  }
}
css.class(cls.listGallery, {
  display: "flex",
  flexWrap: "wrap",
  alignContent: "flex-start",
  flexDirection: "column",
  overflow: "hidden",
});
css.class(cls.listCardHeader, {
  padding: 14,
  fontWeight: 700,
  cursor: "pointer",
});
css.class(cls.listCard, {
  display: "flex",
  flexDirection: "column",
  width: 308,
  backgroundColor: colors.menu,
  marginLeft: LIST_GAP,
  marginTop: LIST_GAP,
  borderRadius: 4,
  overflow: "hidden",

  maxHeight: `calc(100vh - ${LIST_GAP * 2}px - ${c.HEADER_HEIGHT}px - ${
    c.PLAYER_HEIGHT
  }px`,
});

css.class(cls.listTrack, {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  margin: 14,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: 4,
  overflow: "hidden",
  height: 48,
  boxShadow: "2px 2px 2px 0px black",
  cursor: "pointer",
});

css.hover(cls.listTrack, {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
});
css.class2(cls.listTrack, cls.listTrackPlaying, {
  backgroundColor: colors.primary,
});
css.firstOfType(cls.listTrack, {
  marginTop: 0,
});

css.selector(`.${cls.listTrack} img, .${cls.listCardEmptyImage}`, {
  height: 48,
  width: 66,
  marginRight: 14 / 2,
  objectFit: "cover",
});

css.class(cls.listCardEmptyImage, {
  ...css.styles.flexCenter,
  color: "darkgray",
  backgroundColor: colors.gallery,
  fontSize: 12,
});

css.selector(`.${cls.listTrack} span`, {
  flex: 1,
  fontSize: 14,
  lineHeight: 15,
});
//Scrolls
css.class(cls.listCardChildrenContainer, {
  overflowY: "overlay" as any,
  flex: 1,
});

css.text(
  css.styles.cssTextForScrollBar(cls.listCardChildrenContainer, { width: 8 })
);
css.class(cls.listGallery, {
  overflowX: "overlay" as any,
});

css.text(`
  .${cls.listGallery}::-webkit-scrollbar {
    height: 8px;
  }
  
  .${cls.listGallery}::-webkit-scrollbar-thumb {
    background-color: ${colors.scrollBar};
  }
`);
export default ListGallery;
