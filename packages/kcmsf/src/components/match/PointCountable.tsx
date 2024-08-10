import { ActionIcon, Group, MantineColor, Text } from "@mantine/core";
import { useCallback, useState } from "react";

interface Props {
  initial: number;
  color: MantineColor;
  onChange: (count: number) => void;
  validate: (count: number) => boolean;
  disabled: boolean;
  children: React.ReactNode;
}

export const PointCountable = (props: Props) => {
  const [count, setCount] = useState(props.initial);
  const decrementable = props.validate(count - 1);
  const incrementable = props.validate(count + 1);
  const { onChange } = props;

  const decrement = useCallback(() => {
    if (!decrementable) return; // これ以上減らせない

    const nextCount = count - 1;
    setCount(nextCount);
    onChange(nextCount);
  }, [count, decrementable, onChange]);
  const increment = useCallback(() => {
    if (!incrementable) return; // これ以上増やせない

    const nextCount = count + 1;
    setCount(nextCount);
    onChange(nextCount);
  }, [count, incrementable, onChange]);

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-minus"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
        </svg>
     
      </ActionIcon>
      <Text w="auto" size="xl" style={{ flexGrow: 1 }}>
        {count}
      </Text>
      <ActionIcon
        size="xl"
        variant="transparent"
        onClick={increment}
        c={!props.disabled && incrementable ? props.color : undefined}
        disabled={props.disabled || !incrementable}
        bg="white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-plus"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
      </ActionIcon>
    </Group>
  );
};
