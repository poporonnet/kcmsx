import { Button, MantineColor, Text } from "@mantine/core";
import { useState } from "react";

interface Props {
  initial: boolean;
  color: MantineColor;
  onChange: (active: boolean) => void;
  children: React.ReactNode;
}

export const PointSingle = (props: Props) => {
  const [active, setActive] = useState(props.initial);

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
