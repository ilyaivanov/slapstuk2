import { cls, colors, css, utils } from "../infra";

type Props = {
  isBottom?: boolean;
  isActive: boolean;
};

const LoadingStripe = ({ isActive, isBottom }: Props) => (
  <div
    className={utils.cn({
      [cls.loadingStripe]: !isBottom,
      [cls.loadingStripeBottom]: isBottom,
      [cls.loadingStripeActive]: isActive,
    })}
  ></div>
);

export default LoadingStripe;
css.class(cls.loadingStripe, {
  top: 0,
});
css.class(cls.loadingStripeBottom, {
  bottom: 0,
});

css.class(cls.loadingStripeActive, {
  position: "absolute",
  left: 0,
  right: 0,
  backgroundColor: colors.primary,
  height: 4,
  animation: "loadingStripe 2000ms infinite",
});

css.text(`
  @keyframes loadingStripe{
    0%{
      right: 100%;
      left: 0;
    }
    50%{
      right: 0;
      left: 0;
    }
    100%{
      left: 100%;
    }
  }
  `);
