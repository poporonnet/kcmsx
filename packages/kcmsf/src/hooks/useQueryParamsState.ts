import { Cat } from "@mikuroxina/mini-fn";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryParamsState = <T extends string>(
  key: string,
  fallback: T,
  validator: (value: string) => value is T
): [T, (value: T) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<T>(
    Cat.cat(searchParams.get(key)).feed((value) =>
      value != null && validator(value) ? value : fallback
    ).value
  );

  const setQueryParamsState = useCallback(
    (value: T) => {
      setState(value);
      setSearchParams(
        (prev) => {
          if (prev.has(key)) {
            prev.set(key, value);
          } else {
            prev.append(key, value);
          }

          return [...prev.entries()];
        },
        { replace: true }
      );
    },
    [key, setSearchParams]
  );

  return [state, setQueryParamsState];
};
