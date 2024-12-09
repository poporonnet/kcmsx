import { Box, Button, Group, SegmentedControl, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { config, DepartmentType, RobotType } from "config";
import { useEffect, useState } from "react";
import { CreateTeamArgs } from "../types/team";

export const Register = () => {
  const [teamName, setTeamName] = useState("");
  const [clubName, setClubName] = useState("");
  const [robotType, setRobotType] = useState<RobotType>(
    config.departments[0].robotTypes[0]
  );
  const [category, setCategory] = useState<DepartmentType>(
    config.departments[0].type
  );
  const [member, setMember] = useState<[string, string]>(["", ""]);

  // カテゴリーが変更されたとき、ロボットタイプが自明な場合は自動で設定する
  useEffect(() => {
    if (config.department[category].robotTypes.length === 1) {
      setRobotType(config.department[category].robotTypes[0]);
    }
  }, [category]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // メンバーは、オープン部門または小学生部門かつメンバーが1人の場合は配列の要素数を1つにする
    // 2024/1/5 仕様変更に伴いメンバーは入力せずに登録できるようにする
    const data: CreateTeamArgs = {
      name: teamName,
      members: member.filter((v) => v !== ""),
      clubName: clubName,
      departmentType: category,
      robotType: robotType,
    };
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([data]),
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
        <TextInput
          mt={"md"}
          label="クラブ名"
          placeholder="クラブ名を入力してください"
          value={clubName}
          onChange={(event) => setClubName(event.currentTarget.value)}
        />
        <TextInput
          mt={"md"}
          required
          label="メンバーの名前(1人目)"
          placeholder="メンバー(1人目)を入力してください"
          value={member[0]}
          onChange={(event) =>
            setMember((prev) => [event.currentTarget.value, prev[1]])
          }
        />
        <TextInput
          mt={"md"}
          label="メンバーの名前(2人目)"
          placeholder="メンバー(2人目)を入力してください"
          value={member[1]}
          onChange={(event) =>
            setMember((prev) => [prev[0], event.currentTarget.value])
          }
        />
        <SegmentedControl
          mt={"md"}
          fullWidth
          data={config.departments.map((v) => ({
            label: v.name,
            value: v.type,
          }))}
          value={category}
          onChange={(value) => setCategory(value as DepartmentType)}
        />
        <SegmentedControl
          fullWidth
          mt={"md"}
          data={config.department[category].robotTypes.map((v) => ({
            label: v,
            value: v,
          }))}
          value={robotType}
          onChange={(value) => setRobotType(value as RobotType)}
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
