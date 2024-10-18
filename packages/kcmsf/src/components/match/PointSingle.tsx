import { Button, MantineColor, Text } from "@mantine/core";

interface Props {
  color: MantineColor;
  onChange: (active: boolean) => void;
  disabled: boolean;
  children: React.ReactNode;
  value: boolean;
}

export const PointSingle = (props: Props) => (
  <Button
    w="auto"
    h="auto"
    px="lg"
    py="xs"
    variant={props.value ? "filled" : "outline"}
    color={props.color}
    onClick={() => props.onChange(!props.value)}
    disabled={props.disabled}
  >
    <Text size="1.2rem">{props.children}</Text>
  </Button>
);
