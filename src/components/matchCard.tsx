import {Box, Card, Text} from "@mantine/core";


interface MatchCardProps {
  id: number,
  teamName1: string,
  teamName2: string,
  matchType: string,
  coat: number,
  isEnd: boolean,
}

export const MatchCard = (props: MatchCardProps) => {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      m={"sm"}
      withBorder
      variant={"outline"}
      component={props.isEnd ? "div" : "a"}
      href={"/match/" + props.id}
      style={{
        display: "flex",
        width: "12rem",
        height: "8rem",
      }}
    >
      <Box style={{
        color: "black",
        display: "flex",
        alignItems: "center",
      }}>
        <Text size={"lg"}>コート</Text>
        <Text size={"xl"}>{props.coat}</Text>
      </Box>
      <Box style={{
        color: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <Text size={"xs"} style={{fontSize: "1.5rem"}}>{props.teamName1}</Text>
        <Text size={"xs"} style={{fontSize: "1.5rem"}}>{props.teamName2}</Text>
      </Box>
    </Card>
  )
}
