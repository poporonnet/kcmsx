export type PartlyPartial<T, Part extends keyof T> = Omit<T, Part> &
  Partial<Pick<T, Part>>;
