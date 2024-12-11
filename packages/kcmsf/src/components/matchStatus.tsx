import { Button, MantineColor, Text } from "@mantine/core";

export type StatusButtonProps = {
  status: "now" | "future" | "end";
};

export const MatchStatusButton = (props: StatusButtonProps) => {
  const getColorAndText = (): { color: MantineColor; text: string } => {
    switch (props.status) {
      case "now":
        return { color: "green", text: "進行中" };
      case "end":
        return { color: "red", text: "完了" };
      case "future":
        return { color: "blue", text: "未来" };
      default:
        return { color: "blue", text: "未定義" };
    }
  };
  const status = getColorAndText();
  return (
    <Button variant="filled" color={status.color} radius={"lg"} size="xs">
      <Text fw={700}>{status.text}</Text>
    </Button>
  );
};
