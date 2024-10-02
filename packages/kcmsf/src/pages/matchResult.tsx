import { Flex, Paper, Text, Title } from "@mantine/core";
const getResult = () => {
  const result = {
    left: { teamName: "team1", points: 1, time: 1 },
    right: { teamName: "team2", points: 3, time: 4 },
  };
  return result;
};
type MatchResult = {
  id: number;
  teamid: number;
  points: number;
  time: number;
  finishState: string;
};
export const MatchResult = () => {
  //const [matchResult, setMatchResult] = useState<MatchResult | undefined>();
  const result = getResult();
  const rightTeamResult = result.right;
  const leftTeamResult = result.left;
  return (
    <Flex h="100%" direction="column" gap="md" align="center" justify="center">
      <Title order={1} m="1rem">
        試合結果
      </Title>
      <Paper w="100%" withBorder>
        <Flex align="center" justify="center">
          {leftTeamResult && (
            <Text pl="md" size="2rem" c="blue" style={{ flex: 1 }} mr="1rem">
              {leftTeamResult.teamName}
            </Text>
          )}
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue">
              {leftTeamResult.points}
            </Text>
            <Text size="4rem">-</Text>
            <Text size="4rem" c="red">
              {rightTeamResult.points}
            </Text>
          </Flex>
          {rightTeamResult && (
            <Text pr="md" size="2rem" c="red" style={{ flex: 1 }} ml="1rem">
              {rightTeamResult.teamName}
            </Text>
          )}
        </Flex>
        <Flex align="center" justify="center">
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue">
              {leftTeamResult.time}
            </Text>
            <Text size="4rem">-</Text>
            <Text size="4rem" c="red">
              {rightTeamResult.time}
            </Text>
          </Flex>
        </Flex>
      </Paper>
    </Flex>
  );
};
