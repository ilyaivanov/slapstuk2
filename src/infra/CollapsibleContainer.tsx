import React from "react";
import { Styles } from "./style";
import * as anim from "./animations";

type CollapsibleCotainerProps = {
  isOpen: boolean;
  style?: Styles;
  className?: string;
  children: () => React.ReactNode;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
  heightProperty?: string;
};

type State = {
  isVisible: boolean;
};

export default class CollapsibleContainer extends React.PureComponent<
  CollapsibleCotainerProps,
  State
> {
  transitionDuration = 400;
  childRef = React.createRef<HTMLDivElement>();

  state = {
    isVisible: false,
  };

  constructor(props: CollapsibleCotainerProps) {
    super(props);
    this.state = {
      isVisible: props.isOpen,
    };
  }

  getSnapshotBeforeUpdate() {
    if (this.childRef.current) return this.childRef.current.offsetHeight;
  }

  getPropertyToAnimate = () => {
    return this.props.heightProperty || "height";
    // const styles = getComputedStyle(elem);
    // console.log(styles.flex);
    // return styles.flex ? "flex" : "height";
  };

  componentDidUpdate(
    prevProps: CollapsibleCotainerProps,
    prevState: State,
    snapshot: number
  ) {
    const current = this.childRef.current;
    if (!prevProps.isOpen && this.props.isOpen && current) {
      if (this.revertCurrentAnimations()) return;
      this.setState(
        {
          isVisible: true,
        },
        () => {
          const properyName = this.getPropertyToAnimate();
          console.log(properyName);
          const a = anim.animate(
            current,
            [
              { [properyName]: "0px", opacity: 0 },
              {
                [properyName]: current.offsetHeight + "px",
                opacity: 1,
              },
            ],
            {
              duration: this.transitionDuration,
              id: "expanding",
            }
          );
          this.handleAnimationFinish(a);
        }
      );
    } else if (prevProps.isOpen && !this.props.isOpen && current) {
      if (this.revertCurrentAnimations()) return;
      const properyName = this.getPropertyToAnimate();
      const a = anim.animate(
        current,
        [
          {
            [properyName]: current.offsetHeight + "px",
            opacity: 1,
          },
          { [properyName]: "0px", opacity: 0 },
        ],
        {
          duration: this.transitionDuration,
          id: "collapsing",
        }
      );
      this.handleAnimationFinish(a);
    } else if (
      prevState.isVisible &&
      this.state.isVisible &&
      current &&
      snapshot != current.offsetHeight
    ) {
      const currentAnimations = current.getAnimations()[0];
      currentAnimations && currentAnimations.cancel();

      anim.animate(
        current,
        [{ height: current.clientHeight }, { height: current.offsetHeight }],
        { duration: 200, id: "expanding" }
      );
    }
    //TODO: consider how to check if I need to expand contents here
    //try to save current height before update using getSnapshotBeforeUpdate
  }

  handleAnimationFinish = (a: Animation) => {
    a.addEventListener("finish", () => {
      const newIsVisible = a.id != "collapsing";
      if (this.state.isVisible != newIsVisible)
        this.setState({ isVisible: newIsVisible });
    });
  };

  revertCurrentAnimations = () => {
    if (this.childRef.current) {
      const animation = anim.getAnimations(this.childRef.current)[0];
      if (animation) {
        animation.id = animation.id == "expanding" ? "collapsing" : "expanding";
        animation.reverse();
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <div
        className={this.props.className}
        ref={this.childRef}
        style={this.props.style}
        onWheel={this.props.onWheel}
      >
        {this.state.isVisible && this.props.children()}
      </div>
    );
  }
}
