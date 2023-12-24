import { Box, Flex, SegmentedControl, Switch, Title } from "@mantine/core";
import { MatchCard } from "../components/matchCard.tsx";
import { useState } from "react";

// todo: apiからデータを取得する
// データの型は今のelementsとは違うので注意(apiから取ってくる処理をするときに修正する)
// 考慮事項: 予選・決勝で同点の時のじゃんけんの入力をどうするか

export const MatchList = () => {
  const [endCheck, setEndCheck] = useState(false);
  const [category, setCategory] = useState("elementary");
  return (
    <Box style={{ width: "100%" }}>
      <Switch
        checked={endCheck}
        onChange={(event) => setEndCheck(event.currentTarget.checked)}
        label="終了した試合を表示しない"
        style={{
          left: "1rem",
          top: "4.5rem",
          position: "absolute",
        }}
      />
      <Box
        style={{
          margin: "0 auto",
          width: "15rem",
          height: "3rem",
        }}
      >
        <SegmentedControl
          data={[
            { value: "elementary", label: "小学生部門" },
            { value: "open", label: "オープン部門" },
          ]}
          value={category}
          onChange={(value) => setCategory(value)}
          fullWidth
        />
      </Box>
      <Title order={2}>予選</Title>
      <Flex gap="1rem">
        <Box
          style={{
            backgroundColor: "#e0f0e0",
            borderRadius: "0.5rem",
          }}
        >
          <Title order={4}>1コート</Title>
          {elements.map((element) => {
            if (
              element.matchType === "primary" &&
              category === element.category &&
              !(element.isEnd && endCheck) &&
              element.coat === 1
            )
              return (
                <MatchCard
                  id={element.id.toString()}
                  key={element.id}
                  team1={element.team1}
                  teamName1={element.teamName1}
                  team2={element.team2}
                  teamName2={element.teamName2}
                  matchType={element.matchType}
                  isEnd={element.isEnd}
                  category={element.category}
                  isMultiWalk={element.isMultiWalk}
                />
              );
          })}
        </Box>
        <Box
          style={{
            backgroundColor: "#f0f0e0",
            borderRadius: "0.5rem",
          }}
        >
          <Title order={4}>2コート</Title>
          {elements.map((element) => {
            if (
              element.matchType === "primary" &&
              category === element.category &&
              !(element.isEnd && endCheck) &&
              element.coat === 2
            )
              return (
                <MatchCard
                  id={element.id.toString()}
                  key={element.id}
                  team1={element.team1}
                  teamName1={element.teamName1}
                  team2={element.team2}
                  teamName2={element.teamName2}
                  matchType={element.matchType}
                  isEnd={element.isEnd}
                  category={element.category}
                  isMultiWalk={element.isMultiWalk}
                />
              );
          })}
        </Box>
        <Box
          style={{
            backgroundColor: "#f0e0e0",
            borderRadius: "0.5rem",
          }}
        >
          <Title order={4}>3コート</Title>
          {elements.map((element) => {
            if (
              element.matchType === "primary" &&
              category === element.category &&
              !(element.isEnd && endCheck) &&
              element.coat === 3
            )
              return (
                <MatchCard
                  id={element.id.toString()}
                  key={element.id}
                  team1={element.team1}
                  teamName1={element.teamName1}
                  team2={element.team2}
                  teamName2={element.teamName2}
                  matchType={element.matchType}
                  isEnd={element.isEnd}
                  category={element.category}
                  isMultiWalk={element.isMultiWalk}
                />
              );
          })}
        </Box>
      </Flex>
      <Title order={2}>決勝</Title>
      <Flex gap="1rem">
        <Box
          style={{
            backgroundColor: "#e0f0e0",
            borderRadius: "0.5rem",
          }}
        >
          {elements.map((element) => {
            if (
              element.matchType === "final" &&
              category === element.category &&
              !(element.isEnd && endCheck) &&
              element.coat === 1
            )
              return (
                <MatchCard
                  id={element.id.toString()}
                  key={element.id}
                  team1={element.team1.toString()}
                  teamName1={element.teamName1}
                  team2={element.team2.toString()}
                  teamName2={element.teamName2}
                  matchType={element.matchType}
                  isEnd={element.isEnd}
                  category={element.category}
                  isMultiWalk={element.isMultiWalk}
                  />
              );
          })}
        </Box>
        <Box
          style={{
            backgroundColor: "#f0f0e0",
            borderRadius: "0.5rem",
          }}
        >
          {elements.map((element) => {
            if (
              element.matchType === "final" &&
              category === element.category &&
              !(element.isEnd && endCheck) &&
              element.coat === 2
            )
              return (
                <MatchCard
                  id={element.id.toString()}
                  key={element.id}
                  team1={element.team1}
                  teamName1={element.teamName1}
                  team2={element.team2}
                  teamName2={element.teamName2}
                  matchType={element.matchType}
                  isEnd={element.isEnd}
                  category={element.category}
                  isMultiWalk={element.isMultiWalk}
                />
              );
          })}
        </Box>
        <Box
          style={{
            backgroundColor: "#f0e0e0",
            borderRadius: "0.5rem",
          }}
        >
          {elements.map((element) => {
            if (
              element.matchType === "final" &&
              category === element.category &&
              !(element.isEnd && endCheck) &&
              element.coat === 3
            )
              return (
                <MatchCard
                  id={element.id.toString()}
                  key={element.id}
                  team1={element.team1}
                  teamName1={element.teamName1}
                  team2={element.team2}
                  teamName2={element.teamName2}
                  matchType={element.matchType}
                  isEnd={element.isEnd}
                  category={element.category}
                  isMultiWalk={element.isMultiWalk}
                />
              );
          })}
        </Box>
      </Flex>
    </Box>
  );
};

const elements = [
  {
    id: 1375209,
    team1: "1",
    teamName1: "ポケモン",
    team2: "2",
    teamName2: "ドラえもん",
    matchType: "primary",
    coat: 1,
    isEnd: true,
    category: "elementary",
    isMultiWalk: true,
  },
  {
    id: 9325702,
    team1: "3",
    teamName1: "ミッキー",
    team2: "4",
    teamName2: "ドナルド",
    matchType: "primary",
    coat: 1,
    isEnd: false,
    category: "open",
    isMultiWalk: false,
  },
  {
    id: 9237586,
    team1: "5",
    teamName1: "ピカチュウ",
    team2: "6",
    teamName2: "イーブイ",
    matchType: "primary",
    coat: 1,
    isEnd: true,
    category: "open",
    isMultiWalk: false,
  },
  {
    id: 9325402,
    team1: "7",
    teamName1: "スヌーピー",
    team2: "8",
    teamName2: "ドラゴンボール",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9324029,
    team1: "9",
    teamName1: "ポケモン",
    team2: "10",
    teamName2: "ワンピース",
    matchType: "primary",
    coat: 1,
    isEnd: false,
    category: "elementary",
    isMultiWalk: true,
  },
  {
    id: 9325232,
    team1: "11",
    teamName1: "ドラえもん",
    team2: "12",
    teamName2: "ポケモン",
    matchType: "primary",
    coat: 1,
    isEnd: true,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9323812,
    team1: "13",
    teamName1: "ピカチュウ",
    team2: "14",
    teamName2: "イーブイ",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "open",
    isMultiWalk: true,
  },
  {
    id: 9325702,
    team1: "15",
    teamName1: "ミッキー",
    team2: "16",
    teamName2: "ドナルド",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "open",
    isMultiWalk: true,
  },
  {
    id: 9325402,
    team1: "17",
    teamName1: "スヌーピー",
    team2: "18",
    teamName2: "ドラゴンボール",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9324029,
    team1: "19",
    teamName1: "ポケモン",
    team2: "20",
    teamName2: "ワンピース",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "elementary",
    isMultiWalk: true,
  },
  {
    id: 9321232,
    team1: "21",
    teamName1: "ドラえもん",
    team2: "22",
    teamName2: "ポケモン",
    matchType: "primary",
    coat: 3,
    isEnd: true,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9323812,
    team1: "23",
    teamName1: "ピカチュウ",
    team2: "24",
    teamName2: "イーブイ",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "open",
    isMultiWalk: false,
  },
  {
    id: 9376029,
    team1: "25",
    teamName1: "ドラえもん",
    team2: "26",
    teamName2: "ポケモン",
    matchType: "primary",
    coat: 1,
    isEnd: false,
    category: "elementary",
    isMultiWalk: true,
  },
  {
    id: 9325232,
    team1: "27",
    teamName1: "ドラえもん",
    team2: "28",
    teamName2: "ポケモン",
    matchType: "primary",
    coat: 2,
    isEnd: true,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 8435702,
    team1: "29",
    teamName1: "ピカチュウ",
    team2: "30",
    teamName2: "イーブイ",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "open",
    isMultiWalk: true,
  },
  {
    id: 9324029,
    team1: "31",
    teamName1: "ポケモン",
    team2: "32",
    teamName2: "ワンピース",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 2397502,
    team1: "33",
    teamName1: "ピカチュウ",
    team2: "34",
    teamName2: "イーブイ",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "elementary",
    isMultiWalk: true,
  },
  {
    id: 9323812,
    team1: "35",
    teamName1: "ピカチュウ",
    team2: "36",
    teamName2: "イーブイ",
    matchType: "final",
    coat: 1,
    isEnd: false,
    category: "open",
    isMultiWalk: false,
  },
  {
    id: 9325702,
    team1: "37",
    teamName1: "ミッキー",
    team2: "38",
    teamName2: "ドナルド",
    matchType: "final",
    coat: 1,
    isEnd: false,
    category: "open",
    isMultiWalk: false,
  },
  {
    id: 9325402,
    team1: "39",
    teamName1: "スヌーピー",
    team2: "40",
    teamName2: "ドラゴンボール",
    matchType: "final",
    coat: 2,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 4325602,
    team1: "41",
    teamName1: "ピカチュウ",
    team2: "42",
    teamName2: "イーブイ",
    matchType: "final",
    coat: 3,
    isEnd: true,
    category: "open",
    isMultiWalk: true,
  },
  {
    id: 9324029,
    team1: "43",
    teamName1: "ポケモン",
    team2: "44",
    teamName2: "ワンピース",
    matchType: "final",
    coat: 3,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9321232,
    team1: "45",
    teamName1: "ドラえもん",
    team2: "46",
    teamName2: "ポケモン",
    matchType: "final",
    coat: 1,
    isEnd: false,
    category: "elementary",
    isMultiWalk: true,
  },
  {
    id: 9323812,
    team1: "47",
    teamName1: "ピカチュウ",
    team2: "48",
    teamName2: "イーブイ",
    matchType: "final",
    coat: 2,
    isEnd: false,
    category: "open",
    isMultiWalk: false,
  },
  {
    id: 9325702,
    team1: "49",
    teamName1: "ミッキー",
    team2: "50",
    teamName2: "ドナルド",
    matchType: "final",
    coat: 3,
    isEnd: true,
    category: "open",
    isMultiWalk: true,
  },
  {
    id: 9325402,
    team1: "51",
    teamName1: "スヌーピー",
    team2: "52",
    teamName2: "ドラゴンボール",
    matchType: "final",
    coat: 1,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9324029,
    team1: "53",
    teamName1: "ポケモン",
    team2: "54",
    teamName2: "ワンピース",
    matchType: "final",
    coat: 2,
    isEnd: false,
    category: "elementary",
    isMultiWalk: false,
  },
  {
    id: 9321232,
    team1: "55",
    teamName1: "ドラえもん",
    team2: "56",
    teamName2: "ポケモン",
    matchType: "final",
    coat: 3,
    isEnd: true,
    category: "elementary",
    isMultiWalk: true,
  },
];
