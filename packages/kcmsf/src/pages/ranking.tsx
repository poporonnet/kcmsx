// import { Flex, Table, Title } from "@mantine/core";
// import { useEffect, useState } from "react";
// //import { useInterval } from "../hooks/useInterval";
// import "./ranking.css";

// type teamResult = {
//   teamName: string;
//   teamID: string;
//   points: number;
//   time: number;
// };

// type ResultData = {
//   id: string;
//   left: {
//     id: string;
//     teamName: string;
//     isMultiWalk: boolean;
//     category: string;
//   };
//   right: {
//     id: string;
//     teamName: string;
//     isMultiWalk: boolean;
//     category: string;
//   };
//   matchType: string;
//   courseIndex: number;
//   results: {
//     left: {
//       id: string;
//       points: number;
//       time: number;
//     };
//     right: {
//       id: string;
//       points: number;
//       time: number;
//     };
//   };
// };

// function fetchRankingData(resultdata: ResultData[]) {
//   let rankdata: teamResult[] = [];
//   resultdata.forEach((match: ResultData) => {
//     if (match.results && match.matchType == "pre") {
//       Object.keys(match.results).forEach((LR: string) => {
//         const result: teamResult = {
//           teamName: "str",
//           teamID: "0",
//           points: 0,
//           time: 0,
//         };
//         if (LR == "left" || LR == "right") {
//           result.teamName = match.teams[LR].teamName;
//           result.teamID = match.results[LR].id;
//           if (rankdata.length == 0) {
//             result.points = match.results[LR].points;
//             result.time = match.results[LR].time;
//           }
//           rankdata.forEach((elm) => {
//             if (elm.teamID == result.teamID) {
//               result.points = match.results[LR].points + elm.points;
//               result.time = match.results[LR].time + elm.time;
//               rankdata = rankdata.filter(
//                 (result) => result.teamID !== elm.teamID
//               );
//             } else {
//               result.points = match.results[LR].points;
//               result.time = match.results[LR].time;
//             }
//           });
//           rankdata.push(result);
//         }
//       });
//     }
//   });

//   rankdata = rankdata.sort(function (a, b) {
//     if (a.points == b.points) {
//       return a.time > b.time ? 1 : -1;
//     }
//     return a.points > b.points ? -1 : 1;
//   });

//   return rankdata;
// }

// export const Ranking = () => {
//   const [resultdata, setData] = useState<ResultData[]>([]);
//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/match/pre`, { method: "GET" })
//       .then((res) => res.json())
//       .then((json) => setData(json));
//   }, []);

//   const ranking = fetchRankingData(resultdata);

//   return (
//     <>
//       <Flex direction="column" gap={20}>
//         <h1>ランキング</h1>
//         <h2>小学生部門</h2>
//         <RankingTable categoryName="予選" ranking={ranking} />
//       </Flex>
//     </>
//   );
// };

// const RankingTable = (props: {
//   categoryName: string;
//   ranking: teamResult[];
// }) => {
//   if (props.ranking.length == 0) {
//     return (
//       <>
//         <div>
//           <p>結果が出るまでお待ちください</p>
//         </div>
//       </>
//     );
//   }
//   return (
//     <div>
//       <Title order={3}>{props.categoryName}</Title>
//       <Table striped withTableBorder miw="40rem">
//         <Table.Thead>
//           <Table.Tr>
//             <Table.Th>順位</Table.Th>
//             <Table.Th>チーム名</Table.Th>
//             <Table.Th>ポイント</Table.Th>
//             <Table.Th>タイム</Table.Th>
//           </Table.Tr>
//         </Table.Thead>
//         <Table.Tbody>
//           {props.ranking.map((element, index) => (
//             <Table.Tr key={element.teamName}>
//               <Table.Td className="td">{index + 1}</Table.Td>
//               <Table.Td className="td">{element.teamName}</Table.Td>
//               <Table.Td className="td">{element.points}</Table.Td>
//               <Table.Td className="td">{element.time}</Table.Td>
//             </Table.Tr>
//           ))}
//         </Table.Tbody>
//       </Table>
//     </div>
//   );
// };
