import { Box, Flex, SegmentedControl, Switch, Title } from "@mantine/core";
import { MatchCard } from "../components/matchCard.tsx";
import { useState } from "react";

// todo: apiからデータを取得する
// データの型は今のelementsとは違うので注意(apiから取ってくる処理をするときに修正する)
// 考慮事項: 予選・決勝で同点の時のじゃんけんの入力をどうするか
type Match = { id: string, coat: string, category: "elementary" | "open", teams: [{ id: string, teamName: string, isMultiWalk: boolean },{ id: string, teamName: string, isMultiWalk: boolean }], isEnd: boolean, matchType: "primary" | "final"};
const matches: Match[] = [
  {id: "1", coat: "1", category: "elementary", teams: [{id: "1", teamName: "ポケモン", isMultiWalk: true}, {id: "2", teamName: "ドラえもん", isMultiWalk: true}], isEnd: true, matchType: "primary"},
  {id: "2", coat: "1", category: "open", teams: [{id: "3", teamName: "ミッキー", isMultiWalk: false}, {id: "4", teamName: "ドナルド", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "3", coat: "1", category: "open", teams: [{id: "5", teamName: "ピカチュウ", isMultiWalk: false}, {id: "6", teamName: "イーブイ", isMultiWalk: false}], isEnd: true, matchType: "primary"},
  {id: "4", coat: "2", category: "elementary", teams: [{id: "7", teamName: "スヌーピー", isMultiWalk: false}, {id: "8", teamName: "ドラゴンボール", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "5", coat: "1", category: "elementary", teams: [{id: "9", teamName: "ポケモン", isMultiWalk: true}, {id: "10", teamName: "ワンピース", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "6", coat: "1", category: "elementary", teams: [{id: "11", teamName: "ドラえもん", isMultiWalk: false}, {id: "12", teamName: "ポケモン", isMultiWalk: false}], isEnd: true, matchType: "primary"},
  {id: "7", coat: "2", category: "open", teams: [{id: "13", teamName: "ピカチュウ", isMultiWalk: false}, {id: "14", teamName: "イーブイ", isMultiWalk: true}], isEnd: false, matchType: "primary"},
  {id: "8", coat: "2", category: "open", teams: [{id: "15", teamName: "ミッキー", isMultiWalk: true}, {id: "16", teamName: "ドナルド", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "9", coat: "3", category: "elementary", teams: [{id: "17", teamName: "スヌーピー", isMultiWalk: false}, {id: "18", teamName: "ドラゴンボール", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "10", coat: "3", category: "elementary", teams: [{id: "19", teamName: "ポケモン", isMultiWalk: false}, {id: "20", teamName: "ワンピース", isMultiWalk: true}], isEnd: false, matchType: "primary"},
  {id: "11", coat: "3", category: "elementary", teams: [{id: "21", teamName: "ドラえもん", isMultiWalk: false}, {id: "22", teamName: "ポケモン", isMultiWalk: false}], isEnd: true, matchType: "primary"},
  {id: "12", coat: "3", category: "open", teams: [{id: "23", teamName: "ピカチュウ", isMultiWalk: false}, {id: "24", teamName: "イーブイ", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "13", coat: "1", category: "elementary", teams: [{id: "25", teamName: "ドラえもん", isMultiWalk: true}, {id: "26", teamName: "ポケモン", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "14", coat: "2", category: "elementary", teams: [{id: "27", teamName: "ドラえもん", isMultiWalk: false}, {id: "28", teamName: "ポケモン", isMultiWalk: false}], isEnd: true, matchType: "primary"},
  {id: "15", coat: "2", category: "open", teams: [{id: "29", teamName: "ピカチュウ", isMultiWalk: false}, {id: "30", teamName: "イーブイ", isMultiWalk: true}], isEnd: false, matchType: "primary"},
  {id: "16", coat: "2", category: "elementary", teams: [{id: "31", teamName: "ポケモン", isMultiWalk: false}, {id: "32", teamName: "ワンピース", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "17", coat: "3", category: "elementary", teams: [{id: "33", teamName: "ピカチュウ", isMultiWalk: true}, {id: "34", teamName: "イーブイ", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "18", coat: "1", category: "open", teams: [{id: "35", teamName: "ピカチュウ", isMultiWalk: false}, {id: "36", teamName: "イーブイ", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "19", coat: "1", category: "open", teams: [{id: "37", teamName: "ミッキー", isMultiWalk: false}, {id: "38", teamName: "ドナルド", isMultiWalk: false}], isEnd: false, matchType: "final"},
  {id: "20", coat: "2", category: "elementary", teams: [{id: "39", teamName: "スヌーピー", isMultiWalk: false}, {id: "40", teamName: "ドラゴンボール", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "21", coat: "3", category: "open", teams: [{id: "41", teamName: "ピカチュウ", isMultiWalk: true}, {id: "42", teamName: "イーブイ", isMultiWalk: true}], isEnd: true, matchType: "final"},
  {id: "22", coat: "3", category: "elementary", teams: [{id: "43", teamName: "ポケモン", isMultiWalk: false}, {id: "44", teamName: "ワンピース", isMultiWalk: false}], isEnd: false, matchType: "primary"},
  {id: "23", coat: "1", category: "elementary", teams: [{id: "45", teamName: "ドラえもん", isMultiWalk: false}, {id: "46", teamName: "ポケモン", isMultiWalk: true}], isEnd: false, matchType: "primary"},
  {id: "24", coat: "2", category: "open", teams: [{id: "47", teamName: "ピカチュウ", isMultiWalk: false}, {id: "48", teamName: "イーブイ", isMultiWalk: false}], isEnd: false, matchType: "final"},
  {id: "25", coat: "3", category: "open", teams: [{id: "49", teamName: "ミッキー", isMultiWalk: false}, {id: "50", teamName: "ドナルド", isMultiWalk: true}], isEnd: true, matchType: "final"},
  {id: "26", coat: "1", category: "elementary", teams: [{id: "51", teamName: "スヌーピー", isMultiWalk: false}, {id: "52", teamName: "ドラゴンボール", isMultiWalk: false}], isEnd: false, matchType: "final"},
  {id: "27", coat: "2", category: "elementary", teams: [{id: "53", teamName: "ポケモン", isMultiWalk: false}, {id: "54", teamName: "ワンピース", isMultiWalk: false}], isEnd: false, matchType: "final"},
  {id: "28", coat: "3", category: "elementary", teams: [{id: "55", teamName: "ドラえもん", isMultiWalk: false}, {id: "56", teamName: "ポケモン", isMultiWalk: true}], isEnd: true, matchType: "final"},
];


const elementaryMatchesByCoat = matches
.filter((match) => match.category == "elementary")
.reduce<Match[][]>((prev, current) => {
const coat = parseInt(current.coat);
if (prev.length < coat) {
  prev.push([]);
}
prev[coat - 1].push(current);
  return prev;
}, []);
const openMatchesByCoat = matches
.filter((match) => match.category == "open")
.reduce<Match[][]>((prev, current) => {
const coat = parseInt(current.coat);
if (prev.length < coat) {
  prev.push([]);
}
prev[coat - 1].push(current);
  return prev;
}, []);

export const MatchList = () => {
  const [endCheck, setEndCheck] = useState(false);
  const [category, setCategory] = useState<"elementary" | "open">("elementary");
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
          onChange={(value) => setCategory(value as "elementary" | "open")}
          fullWidth
        />
      </Box>
      <Title order={2}>予選</Title>
      <Flex gap="1rem">
        {category == "elementary" &&
          elementaryMatchesByCoat.map((matches, index) => (
            <Flex direction="column" gap="1rem" key={index}>
              <Box style={{
                 backgroundColor: "#e0f0e0",
                 borderRadius: "0.5rem",
                 }}>
              <Title p={"sm"} m={0} order={3}>コート{index + 1}</Title>
              {matches.map((match) => {
                if (match.matchType == "final" || (endCheck && match.isEnd)) return;
                return (
                <MatchCard
                key={match.id}
                  id={match.id}
                  teams={match.teams}
                  matchType={match.matchType}
                  isEnd={match.isEnd}
                  category={match.category}
                />
                )
              }
            )}
            </Box>
              </Flex>
          ))}
        {category == "open" &&
          openMatchesByCoat.map((matches, index) => (
            <Flex direction="column" gap="1rem" key={index}>
              <Box style={{
                 backgroundColor: "#e0f0e0",
                 borderRadius: "0.5rem",
                 }}>
              <Title p={"sm"} m={0} order={3}>コート{index + 1}</Title>
              {matches.map((match) => {
                if (match.matchType == "final" || (endCheck && match.isEnd)) return;
                return (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    teams={match.teams}
                    matchType={match.matchType}
                    isEnd={match.isEnd}
                    category={match.category}
                  />
                )
              }
            )}
            </Box>
              </Flex>
          ))}

      </Flex>
      <Title order={2}>決勝</Title>
      <Flex gap="1rem">
        {category == "elementary" &&
          elementaryMatchesByCoat.map((matches, index) => (
            <Flex direction="column" gap="1rem" key={index}>
              <Box style={{
                  backgroundColor: "#e0f0e0",
                  borderRadius: "0.5rem",
                  }}>
              <Title p={"sm"} m={0} order={3}>コート{index + 1}</Title>
              {matches.map((match) => {
                if (match.matchType == "primary" || (endCheck && match.isEnd)) return;
                return (
                <MatchCard
                key={match.id}
                  id={match.id}
                  teams={match.teams}
                  matchType={match.matchType}
                  isEnd={match.isEnd}
                  category={match.category}
                />
                )
              }
            )}
            </Box>
          </Flex>
        ))}
        {category === "open" &&
          openMatchesByCoat.map((matches, index) => (
            <Flex direction="column" gap="1rem" key={index}>
              <Box style={{
                  backgroundColor: "#e0f0e0",
                  borderRadius: "0.5rem",
                  }}>
              <Title p={"sm"} m={0} order={3}>コート{index + 1}</Title>
              {matches.map((match) => {
                if (match.matchType == "primary" || (endCheck && match.isEnd)) return;
                return (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    teams={match.teams}
                    matchType={match.matchType}
                    isEnd={match.isEnd}
                    category={match.category}
                  />
                )
              }
            )}
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
