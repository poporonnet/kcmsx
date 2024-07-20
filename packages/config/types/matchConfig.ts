export type MatchConfig = {
  type: string;
  name: string;
  limitSeconds: number;
};

export type DerivedMatch<Matches extends MatchConfig[]> = {
  [M in Matches[number] as M["type"]]: Omit<M, "type">
}