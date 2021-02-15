//[0 .. to] inclusive
export const generateNumbers = (to: number) =>
  Array.from(new Array(to)).map((_, index) => index);

export function hexToRGBA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export const max = (vals: number[]): number | undefined => {
  if (vals.length > 0) {
    let max = vals[0];
    for (var i = 0; i < vals.length; i++) {
      if (max < vals[i]) max = vals[i];
    }
    return max;
  }
  return undefined;
};

export const findDuplicates = <T>(vals: T[]): T[] => {
  const duplicates = [];
  const set = new Set<T>();
  for (var i = 0; i < vals.length; i++) {
    if (set.has(vals[i])) duplicates.push(vals[i]);
    else set.add(vals[i]);
  }
  return duplicates;
};

export const resolvePromiseIn = <T>(val: T, delay: number): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, delay);
  });
export function generateRandomColorHsl() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * (100 + 1)) + "%";
  const lightness = Math.floor(Math.random() * (100 / 2 + 1)) + "%";
  return "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
}
