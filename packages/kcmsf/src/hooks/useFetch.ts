import { useCallback, useEffect, useState } from "react";
import { useConsistentRef } from "./useConsistentRef";

type Option<Response extends object> = {
  auto?: boolean;
  onFetch?: (data: Response) => void;
};

type UseFetch<Response extends object> = {
  data?: Response;
  error?: Error;
  loading: boolean;
  refetch: () => Promise<void>;
};

export const useFetch = <Response extends object>(
  query: string,
  init: RequestInit = {},
  option: Option<Response> = {
    auto: true,
    onFetch: undefined,
  }
): UseFetch<Response> => {
  const [data, setData] = useState<Response>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const initRef = useConsistentRef(init);
  const optionRef = useConsistentRef(option);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const res = await fetch(query, initRef.current);
      if (!res.ok) throw res;

      const data = (await res.json()) as Response;

      setLoading(false);
      setData(data);
      optionRef.current.onFetch?.(data);
    } catch (err) {
      const error = new Error("Failed to fetch data", { cause: err });

      setLoading(false);
      setData(undefined);
      setError(error);
      throw error;
    }
  }, [query, setData, setError, initRef, optionRef]);

  useEffect(() => {
    if (!option.auto) return;

    refetch();
  }, [option.auto, refetch]);

  return { data, error, loading, refetch };
};
