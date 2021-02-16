import { Styles, convertNumericStylesToPixels } from "./style";

//this module allows using numbers for properties for animation
//also in case I will be using unit tests with jest, I can mock animations more easily if it is extracted

export const animate = (
  element: HTMLElement,
  //I'm using my plain styles here, even thought Keyframe has three additional properies
  // like CompositeOperationOrAuto, but sinse I'm not using them and do not forsee usage, I won't add them into types
  // future me - please add type union if you are going to use config for each frame
  frames: Styles[],
  options: KeyframeAnimationOptions
) => {
  const convertedStyles = frames.map(convertNumericStylesToPixels);
  return element.animate(convertedStyles as any, options);
};

export const getAnimations = (element: HTMLElement): Animation[] => {
  return element.getAnimations();
};
