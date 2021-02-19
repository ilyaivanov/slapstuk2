import { cls, css, utils } from "../infra";

const LoadingSpinner = () => (
  <div className={cls.galleryLoadingContainer}>
    <div className={cls.loadGrid}>
      {utils.generateNumbers(9).map((i) => (
        <div key={i + ""} />
      ))}
    </div>
  </div>
);

export default LoadingSpinner;

css.class(cls.galleryLoadingContainer, {
  width: "100%",
  ...css.styles.flexCenter,
});

//taked from https://loading.io/css/
css.text(`
.${cls.loadGrid} {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.${cls.loadGrid} div {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  animation: load-grid 1.2s linear infinite;
}
.${cls.loadGrid} div:nth-child(1) {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.${cls.loadGrid} div:nth-child(2) {
  top: 8px;
  left: 32px;
  animation-delay: -0.4s;
}
.${cls.loadGrid} div:nth-child(3) {
  top: 8px;
  left: 56px;
  animation-delay: -0.8s;
}
.${cls.loadGrid} div:nth-child(4) {
  top: 32px;
  left: 8px;
  animation-delay: -0.4s;
}
.${cls.loadGrid} div:nth-child(5) {
  top: 32px;
  left: 32px;
  animation-delay: -0.8s;
}
.${cls.loadGrid} div:nth-child(6) {
  top: 32px;
  left: 56px;
  animation-delay: -1.2s;
}
.${cls.loadGrid} div:nth-child(7) {
  top: 56px;
  left: 8px;
  animation-delay: -0.8s;
}
.${cls.loadGrid} div:nth-child(8) {
  top: 56px;
  left: 32px;
  animation-delay: -1.2s;
}
.${cls.loadGrid} div:nth-child(9) {
  top: 56px;
  left: 56px;
  animation-delay: -1.6s;
}
@keyframes load-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
`);

/* export const viewSubtracksLoadingGrid = (item: Item): DivDefinition => ({
  style: {
    ...styles.flexCenter,
    margin: "10px",
    marginTop: "0",
  },
  children: {
    className: cls.loadGrid,

    children: Array.from(new Array(9)).map(() => ({
      style: {
        backgroundColor: style.getItemColor(item),
      },
    })),
  },
});
*/
