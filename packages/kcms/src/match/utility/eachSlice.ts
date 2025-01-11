export const eachSlice = <T>(array: T[], size: number): T[][] =>
  new Array(Math.ceil(array.length / size))
    .fill(null)
    .map((_, i) => array.slice(i * size, (i + 1) * size));
