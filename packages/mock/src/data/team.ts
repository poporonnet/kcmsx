export interface Team {
  id: string;
  name: string;
  entryId: string;
  members: string[];
  clubName: string;
  robotType: string;
  category: string;
  isEntered: boolean;
}

export const teams = [
  {
    id: "1392387",
    name: "かに1",
    entryId: "1",
    members: ["メンバー1", "メンバー2"],
    clubName: "RubyClub",
    robotType: "wheel",
    category: "elementary",
    isEntered: true,
  },
  {
    id: "7549586",
    name: "かに2",
    entryId: "2",
    members: ["メンバー3"],
    clubName: "RubyClub",
    robotType: "wheel",
    category: "elementary",
    isEntered: false,
  },
  {
    id: "4578932",
    name: "かに3",
    entryId: "3",
    members: ["メンバー4"],
    clubName: "",
    robotType: "leg",
    category: "open",
    isEntered: true,
  },
] as const satisfies Team[];
