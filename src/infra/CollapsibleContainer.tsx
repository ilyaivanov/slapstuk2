import React, { useReducer } from "react";
import { cls } from "./keys";
import { cssClass } from "./style";
import * as anim from "./animations";

cssClass(cls.childrenContainer, {
  overflow: "hidden",
});

type CollapsibleCotainerProps = {
  isOpen: boolean;
  children: () => React.ReactElement;
};

export default class CollapsibleContainer extends React.Component<CollapsibleCotainerProps> {
  transitionDuration = 200;
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

  componentDidUpdate(preProps: CollapsibleCotainerProps) {
    const current = this.childRef.current;

    console.log("did update", preProps, this.props);
    if (!preProps.isOpen && this.props.isOpen && current) {
      if (this.revertCurrentAnimations()) return;
      this.setState(
        {
          isVisible: true,
        },
        () => {
          const a = anim.animate(
            current,
            [
              { height: 0, opacity: 0 },
              {
                height: current.clientHeight,
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
    } else if (preProps.isOpen && !this.props.isOpen && current) {
      if (this.revertCurrentAnimations()) return;
      const a = anim.animate(
        current,
        [
          {
            height: current.clientHeight,
            opacity: 1,
          },
          { height: 0, opacity: 0 },
        ],
        {
          duration: this.transitionDuration,
          id: "collapsing",
        }
      );
      this.handleAnimationFinish(a);
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
      <div className={cls.childrenContainer} ref={this.childRef}>
        {this.state.isVisible && this.props.children()}
      </div>
    );
  }
}
