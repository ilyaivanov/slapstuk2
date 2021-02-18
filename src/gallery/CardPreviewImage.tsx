import React from "react";
import { cls, css } from "../infra";
import * as items from "../items";
import * as c from "./constants";

type CardPreviewImageProps = {
  item: Item;
  allItems: Items;
};
const CardPreviewImage = ({ item, allItems }: CardPreviewImageProps) => (
  <div
    className={cls.cardPreviewContainer}
    style={{
      overflow: "hidden",
      paddingBottom: items.isOpenAtGallery(item)
        ? "0"
        : c.initialPaddingPercent,
      position: "relative",
    }}
  >
    {items.isFolder(item) ? (
      <PreviewGrid item={item} allItems={allItems} />
    ) : (
      <PreviewImage item={item} />
    )}
  </div>
);

export default CardPreviewImage;

const PreviewImage = ({ item }: { item: Item }) => (
  <img
    style={{
      //TODO: extract styles into classes
      ...css.styles.overlay,
      width: "100%",
      height: "100%",
      display: "block",
      objectFit: "cover",
      //this makes animation better for non-channel items
      objectPosition: "top",
    }}
    src={items.getImageSrc(item)}
    draggable="false"
  />
);
type PreviewGridProps = {
  item: Folder;
  allItems: Items;
};
const PreviewGrid = ({ item, allItems }: PreviewGridProps) => {
  const previewImages = items.getPreviewImages(item, 4, allItems);
  if (previewImages.length == 0)
    <div
      style={{
        ...css.styles.flexCenter,
        ...css.styles.overlay,
        color: "gray",
        fontSize: "40px",
      }}
    >
      Empty
    </div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        gridTemplateRows: "50% 50%",
        gridGap: "2px",
        ...css.styles.overlay,
      }}
    >
      {previewImages.map((src, index) => (
        <img
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "top",
          }}
          src={src}
          key={src + index}
          draggable="false"
        />
      ))}
    </div>
  );
};
