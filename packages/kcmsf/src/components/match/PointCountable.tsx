import { ActionIcon, Group, MantineColor, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useCallback } from "react";

interface Props {
  value: number;
  color: MantineColor;
  onChange: (count: number) => void;
  validate: (count: number) => boolean;
  disabled: boolean;
  children: React.ReactNode;
}

export const PointCountable = (props: Props) => {
  const { value, onChange } = props;
  const decrementable = props.validate(value - 1);
  const incrementable = props.validate(value + 1);

  const decrement = useCallback(() => {
    if (!decrementable) return; // これ以上減らせない

    const nextCount = value - 1;
    onChange(nextCount);
  }, [value, decrementable, onChange]);
  const increment = useCallback(() => {
    if (!incrementable) return; // これ以上増やせない

    const nextCount = value + 1;
    onChange(nextCount);
  }, [value, incrementable, onChange]);

  return (
    <Group>
      <Text size="1.2rem" c={props.color} style={{ flexGrow: 1 }}>
        {props.children}:
      </Text>
      <ActionIcon
        size="xl"
        variant="transparent"
        onClick={decrement}
        c={!props.disabled && decrementable ? props.color : undefined}
        disabled={props.disabled || !decrementable}
        bg="white"
      >
        <IconMinus style={{ width: "100%", height: "100%" }} />
      </ActionIcon>
      <Text w="auto" size="xl" style={{ flexGrow: 1 }}>
        {value}
      </Text>
      <ActionIcon
        size="xl"
        variant="transparent"
        onClick={increment}
        c={!props.disabled && incrementable ? props.color : undefined}
        disabled={props.disabled || !incrementable}
        bg="white"
      >
        <IconPlus style={{ width: "100%", height: "100%" }} />
      </ActionIcon>
    </Group>
  );
};
