import { Side, Against } from "../types/matchInfo";

export const against = <S extends Side>(side: S): Against<S> =>
  (side == "left" ? "right" : "left") as Against<S>;
