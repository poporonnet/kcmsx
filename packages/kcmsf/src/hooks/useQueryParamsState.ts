import { Cat } from "@mikuroxina/mini-fn";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryParamsState = <T extends string>(
  key: string,
  fallback: T,
  validator: (value: string) => value is T
) => {
  const [searchParams] = useSearchParams();
  return useState<T>(
    Cat.cat(searchParams.get(key)).feed((value) =>
      value != null && validator(value) ? value : fallback
    ).value
  );
};
