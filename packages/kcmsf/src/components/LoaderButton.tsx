import { Button, ButtonProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useCallback } from "react";

export const LoaderButton = forwardRef<
  HTMLButtonElement,
  { load: () => Promise<void> } & ButtonProps
>(({ load, ...props }, ref) => {
  const [loading, { open: startLoad, close: finishLoad }] = useDisclosure();
  const onClick = useCallback(async () => {
    startLoad();
    await load().catch((err) => console.error(err));
    finishLoad();
  }, [load, startLoad, finishLoad]);

  return (
    <Button
      loading={loading}
      loaderProps={{ type: "dots" }}
      {...props}
      onClick={onClick}
      ref={ref}
    />
  );
});
