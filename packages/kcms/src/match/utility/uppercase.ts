export const upcase = <T extends string>(str: T): Uppercase<T> => str.toUpperCase() as Uppercase<T>;
