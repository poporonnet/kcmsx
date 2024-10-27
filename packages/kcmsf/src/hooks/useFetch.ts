import { useCallback, useEffect, useState } from "react";

type Option = {
  auto?: boolean;
};

type UseFetch<Response extends object> = {
  data?: Response;
  error?: Error;
  loading: boolean;
  refetch: () => Promise<void>;
};

export const useFetch = <Response extends object>(
  query: string,
  option: Option = {
    auto: true,
  }
): UseFetch<Response> => {
  const [data, setData] = useState<Response>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const res = await fetch(query);
      const data = (await res.json()) as Response;

      setLoading(false);
      setData(data);
    } catch (err) {
      const error = new Error("Failed to fetch data", { cause: err });

      setLoading(false);
      setData(undefined);
      setError(error);
      throw error;
    }
  }, [query, setData, setError]);

  useEffect(() => {
    if (!option.auto) return;

    refetch();
  }, [option.auto, refetch]);

  return { data, error, loading, refetch };
};
