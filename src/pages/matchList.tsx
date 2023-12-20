import { Table, Box, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "./matchList.css";
export const MatchList = () => {
  const elements = [
    {
      id: 43945095,
      teamName1: "大化",
      teamName2: "白雉",
      matchType: "primary",
    },
    {
      id: 43945096,
      teamName1: "朱鳥",
      teamName2: "大宝",
      matchType: "primary",
    },
    {
      id: 43945097,
      teamName1: "慶雲",
      teamName2: "和銅",
      matchType: "primary",
    },
    {
      id: 2735029,
      teamName1: "霊亀",
      teamName2: "養老",
      matchType: "primary",
    },
    {
      id: 2736340,
      teamName1: "神亀",
      teamName2: "天平",
      matchType: "primary",
    },
    {
      id: 2835702,
      teamName1: "天平感宝",
      teamName2: "天平勝宝",
      matchType: "primary",
    },
    {
      id: 3583923,
      teamName1: "天平宝字",
      teamName2: "天平神護",
      matchType: "primary",
    },
    {
      id: 2397502,
      teamName1: "神護景雲",
      teamName2: "宝亀",
      matchType: "primary",
    },
    {
      id: 9357094,
      teamName1: "天応",
      teamName2: "延暦",
      matchType: "primary",
    },
    {
      id: 1375209,
      teamName1: "大同",
      teamName2: "弘仁",
      matchType: "primary",
    },
    {
      id: 9237586,
      teamName1: "天長",
      teamName2: "承和",
      matchType: "primary",
    },
    {
      id: 9375029,
      teamName1: "嘉祥",
      teamName2: "仁寿",
      matchType: "primary",
    },
    {
      id: 9325702,
      teamName1: "斉衡",
      teamName2: "天安",
      matchType: "primary",
    },
    {
      id: 9325702,
      teamName1: "貞観",
      teamName2: "元慶",
      matchType: "primary",
    },
    {
      id: 9324029,
      teamName1: "仁和",
      teamName2: "寛平",
      matchType: "final",
    },
    {
      id: 9325702,
      teamName1: "昌泰",
      teamName2: "延喜",
      matchType: "primary",
    },
    {
      id: 5583923,
      teamName1: "延長",
      teamName2: "承平",
      matchType: "final",
    },
    {
      id: 2397502,
      teamName1: "天慶",
      teamName2: "天暦",
      matchType: "final",
    },
    {
      id: 9357094,
      teamName1: "天徳",
      teamName2: "応和",
      matchType: "final",
    },
    {
      id: 1375209,
      teamName1: "康保",
      teamName2: "安和",
      matchType: "final",
    },
  ];
  const primary_rows = elements.map((element) =>
    element.matchType === "primary" ? (
      <Table.Tr key={element.id}>
        <Table.Td className="td">{element.teamName1}</Table.Td>
        <Table.Td className="td">{element.teamName2}</Table.Td>
      </Table.Tr>
    ) : null
  );
  const final_rows = elements.map((element) =>
    element.matchType === "final" ? (
      <Table.Tr key={element.id}>
        <Table.Td className="td">{element.teamName1}</Table.Td>
        <Table.Td className="td">{element.teamName2}</Table.Td>
      </Table.Tr>
    ) : null
  );
  console.log(primary_rows);
  return (
    <Box>
      <Title order={3}>第1回 Matz葉がにロボコン予選表</Title>
      <Carousel withIndicators>
        <Carousel.Slide>
          <Table stickyHeader stickyHeaderOffset={60} striped miw="30rem">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>チーム1</Table.Th>
                <Table.Th>チーム2</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{primary_rows}</Table.Tbody>
          </Table>
        </Carousel.Slide>
        <Carousel.Slide>
          <Table stickyHeader stickyHeaderOffset={60} striped miw="30rem">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>チーム1</Table.Th>
                <Table.Th>チーム2</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{final_rows}</Table.Tbody>
          </Table>
        </Carousel.Slide>
      </Carousel>
    </Box>
  );
};
