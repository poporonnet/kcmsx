import { Button, MantineColor, Text } from "@mantine/core";
import { useState } from "react";

export const PointSingle = (props: {
  color: MantineColor;
  onChange: (active: boolean) => void;
  children: React.ReactNode;
}) => {
  const [active, setActive] = useState(false);

  return (
    <Button
      w="auto"
      h="auto"
      px="lg"
      py="xs"
      variant={active ? "filled" : "outline"}
      color={props.color}
      onClick={() => {
        props.onChange(!active);
        setActive(() => !active);
      }}
    >
      <Text size="1.2rem">{props.children}</Text>
    </Button>
  );
};
