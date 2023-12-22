import { Option, Result } from "@mikuroxina/mini-fn";
import { MatchRepository } from "./repository.js";
import { MatchDTO } from "./get.js";
import { ReconstructMatchArgs } from "../match.js";

export class EditMatchService {
  private readonly matchRepository: MatchRepository;

  constructor(matchRepository: MatchRepository) {
    this.matchRepository = matchRepository;
  }

  async handle(
    id: string,
    args: Partial<Pick<ReconstructMatchArgs, "points" | "time" | "winnerID">>,
  ): Promise<Result.Result<Error, MatchDTO>> {
    const match = await this.matchRepository.findByID(id);
    if (Option.isNone(match)) return Result.err(new Error("Match not found"));

    if (args.points !== undefined) match[1].points = args.points;
    if (args.time !== undefined) match[1].time = args.time;

    if (args.winnerID !== undefined) {
      match[1].winnerID = args.winnerID;
    }

    const res = await this.matchRepository.update(match[1]);
    if (Result.isErr(res)) return Result.err(res[1]);
    const json = MatchDTO.fromDomain(res[1]);
    return Result.ok(json);
  }
}
