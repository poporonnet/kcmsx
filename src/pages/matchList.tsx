import {Box, Group, SegmentedControl, Switch, Title} from "@mantine/core";
import {MatchCard} from "../components/matchCard.tsx";
import "./matchList.css";
import {useState} from "react";

const elements = [
  {
    id: 1375209,
    teamName1: "大同",
    teamName2: "弘仁",
    matchType: "primary",
    coat: 1,
    isEnd: true,
    category: "elementary",
  },
  {
    id: 9325702,
    teamName1: "応和",
    teamName2: "康保",
    matchType: "primary",
    coat: 1,
    isEnd: false,
    category: "open",
  },
  {
    id: 9237586,
    teamName1: "天長",
    teamName2: "承和",
    matchType: "primary",
    coat: 1,
    isEnd: true,
    category: "open",
  },
  {
    id: 9325402,
    teamName1: "安和",
    teamName2: "天禄",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 9324029,
    teamName1: "仁和",
    teamName2: "寛平",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 9325232,
    teamName1: "斉衡",
    teamName2: "天安",
    matchType: "primary",
    coat: 2,
    isEnd: true,
    category: "elementary",
  },
  {
    id: 9323812,
    teamName1: "天暦",
    teamName2: "天徳",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "open",
  },
  {
    id: 9325702,
    teamName1: "応和",
    teamName2: "康保",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "open",
  },
  {
    id: 9325402,
    teamName1: "安和",
    teamName2: "天禄",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 9324029,
    teamName1: "仁和",
    teamName2: "寛平",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 9321232,
    teamName1: "斉衡",
    teamName2: "天安",
    matchType: "primary",
    coat: 3,
    isEnd: true,
    category: "elementary",
  },
  {
    id: 9323812,
    teamName1: "天暦",
    teamName2: "天徳",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "open",
  },
  {
    id: 9376029,
    teamName1: "嘉祥",
    teamName2: "仁寿",
    matchType: "primary",
    coat: 1,
    isEnd: true,
    category: "elementary",
  },
  {
    id: 9325232,
    teamName1: "斉衡",
    teamName2: "天安",
    matchType: "primary",
    coat: 2,
    isEnd: true,
    category: "elementary",
  },
  {
    id: 8435702,
    teamName1: "貞観",
    teamName2: "元慶",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "open",
  },
  {
    id: 9324029,
    teamName1: "仁和",
    teamName2: "寛平",
    matchType: "primary",
    coat: 2,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 2397502,
    teamName1: "天慶",
    teamName2: "天暦",
    matchType: "primary",
    coat: 3,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 9323812,
    teamName1: "天暦",
    teamName2: "天徳",
    matchType: "final",
    coat: 1,
    isEnd: false,
    category: "open",
  },
  {
    id: 9325702,
    teamName1: "応和",
    teamName2: "康保",
    matchType: "final",
    coat: 1,
    isEnd: false,
    category: "open",
  },
  {
    id: 9325402,
    teamName1: "安和",
    teamName2: "天禄",
    matchType: "final",
    coat: 2,
    isEnd: false,
    category: "elementary",
  },
  {
    id: 4325602,
    teamName1: "天延",
    teamName2: "貞元",
    matchType: "final",
    coat: 3,
    isEnd: true,
    category: "open",
  },
];
export const MatchList = () => {
  const [checked, setChecked] = useState(false);
  const [category, setCategory] = useState("elementary");
  const hasFinalMatch = elements.some((element) => element.matchType === "final");
  return (
    <Box style={{
      width: "100%",
    }}>
      <Switch
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
        label="終了した試合を表示しない"
        style={{
          left: "1rem",
          top: "4.5rem",
          position: "absolute",
        }}
      />
      <Box style={{
        margin: "0 auto",
        width: "15rem",
        height: "3rem",
      }}>
        <SegmentedControl
          data={[
            {value: "elementary", label: "小学生部門"},
            {value: "open", label: "オープン部門"},
          ]}
          value={category}
          onChange={(value) => setCategory(value)}
          fullWidth
        />
      </Box>
      <Title order={3}>予選</Title>
      <Group gap="md">
        {elements.map((element) => {
          if (element.matchType === "primary" && category === element.category && !(element.isEnd && checked))
            return (
              <MatchCard
                id={element.id}
                key={element.id}
                teamName1={element.teamName1}
                teamName2={element.teamName2}
                matchType={element.matchType}
                coat={element.coat}
                isEnd={element.isEnd}
              />
            );
        })}
      </Group>
      {hasFinalMatch && (
        <>
          <Title order={3}>決勝</Title>
          <Group gap="md">
            {elements.map((element) => {
              if (element.matchType === "final" && category === element.category && !(element.isEnd && checked))
                return (
                  <MatchCard
                    id={element.id}
                    key={element.id}
                    teamName1={element.teamName1}
                    teamName2={element.teamName2}
                    matchType={element.matchType}
                    coat={element.coat}
                    isEnd={element.isEnd}
                  />
                );
            })}
          </Group>
        </>
      )}
    </Box>
  );
};
