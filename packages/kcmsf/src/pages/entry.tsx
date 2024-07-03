import { Box, Button, Group, SegmentedControl, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
export const Entry = () => {
  const [teamName, setTeamName] = useState("");
  const [isMultiWalk, setIsMultiWalk] = useState(true); // ロボットが多足歩行型か
  const [category, setCategory] = useState("Elementary"); // 出場する部門 小学生部門:メンバー最大2人 オープン部門：1人
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // メンバーは、オープン部門または小学生部門かつメンバーが1人の場合は配列の要素数を1つにする
    // 2024/1/5 仕様変更に伴いメンバーは入力せずに登録できるようにする
    const data = {
      teamName: teamName,
      members: ["aa"],
      isMultiWalk: isMultiWalk,
      category: category,
    };
    const res = await fetch(`${import.meta.env.VITE_API_URL}/entry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      notifications.show({
        title: "登録完了",
        message: "登録が完了しました",
        color: "green",
      });
    } else {
      notifications.show({
        title: "登録失敗",
        message: "登録に失敗しました",
        color: "red",
      });
    }
  }
  return (
    <Box maw={620} mx={"auto"}>
      <form onSubmit={submit}>
        <TextInput
          mt={"md"}
          label="チーム名"
          required
          placeholder="チーム名を入力してください"
          value={teamName}
          onChange={(event) => setTeamName(event.currentTarget.value)}
        />
        <SegmentedControl
          mt={"md"}
          fullWidth
          data={[
            { label: "小学生部門", value: "Elementary" },
            { label: "オープン部門", value: "Open" },
          ]}
          value={category}
          onChange={(value) => setCategory(value)}
        />
        <SegmentedControl
          fullWidth
          mt={"md"}
          data={[
            { label: "歩行型", value: "walk" },
            { label: "車輪型", value: "tire" },
          ]}
          value={isMultiWalk ? "walk" : "tire"}
          onChange={(value) => setIsMultiWalk(value === "walk")}
        />
        <Group justify={"flex-start"}>
          <Button mt={"md"} type="submit">
            登録
          </Button>
        </Group>
      </form>
    </Box>
  );
};
