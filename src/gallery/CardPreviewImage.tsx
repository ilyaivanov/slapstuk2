import React from "react";
import { cls, css, utils } from "../infra";
import * as items from "../state";
import * as c from "./constants";

type CardPreviewImageProps = {
  item: Item;
  allItems: Items;
};
const CardPreviewImage = ({ item, allItems }: CardPreviewImageProps) => (
  <div
    className={utils.cn({
      [cls.cardPreviewContainer]: true,
      [cls.cardPreviewContainerClosed]: items.isOpenAtGallery(item),
    })}
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
    className={cls.previewImage + " " + cls.overlay}
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
    <div className={cls.emptyCardPreview}>Empty</div>;

  return (
    <div className={cls.previewImageGrid}>
      {previewImages.map((src, index) => (
        <img
          className={cls.previewImage}
          src={src}
          key={src + index}
          draggable="false"
        />
      ))}
    </div>
  );
};

css.class(cls.cardPreviewContainer, {
  overflow: "hidden",
  position: "relative",
  paddingBottom: c.initialPaddingPercent,
});

css.class(cls.cardPreviewContainerClosed, {
  paddingBottom: 0,
});

css.class(cls.previewImage, {
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
  //this makes animation better for non-channel items
  objectPosition: "top",
});

css.class(cls.previewImageGrid, {
  display: "grid",
  gridTemplateColumns: "50% 50%",
  gridTemplateRows: "50% 50%",
  gridGap: "2px",
  ...css.styles.overlay,
});

css.class(cls.emptyCardPreview, {
  ...css.styles.flexCenter,
  ...css.styles.overlay,
  color: "gray",
  fontSize: "40px",
});

css.class(cls.overlay, {
  ...css.styles.overlay,
});
