import { TeamRepository } from './models/repository.js';
import { CreateTeamService } from './service/createTeam';
import { Result, Option } from '@mikuroxina/mini-fn';
import { FetchTeamService } from './service/get.js';
import { DeleteEntryService } from './service/delete.js';
import { SnowflakeIDGenerator } from '../id/main.js';
import { DepartmentType } from 'config';

interface baseEntry {
  id: string;
  teamName: string;
  members: string[];
  isMultiWalk: boolean;
  category: string;
}

export class Controller {
  private readonly createTeam: CreateTeamService;
  private readonly findEntry: FetchTeamService;
  private readonly deleteService: DeleteEntryService;

  constructor(repository: TeamRepository) {
    this.createTeam = new CreateTeamService(
      repository,
      new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
    );
    this.findEntry = new FetchTeamService(repository);
    this.deleteService = new DeleteEntryService(repository);
  }

  async create(args: {
    teamName: string;
    members: string[];
    isMultiWalk: boolean;
    category: 'Elementary' | 'Open';
    departmentType: DepartmentType;
  }): Promise<Result.Result<Error, baseEntry>> {
    const res = await this.createTeam.create(args);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    const unwrapped = Result.unwrap(res);
    return Result.ok({
      id: unwrapped.getId(),
      teamName: unwrapped.getTeamName(),
      members: unwrapped.getMembers(),
      isMultiWalk: unwrapped.getIsMultiWalk(),
      category: unwrapped.getCategory(),
    });
  }

  async get(): Promise<Result.Result<Error, baseEntry[]>> {
    const res = await this.findEntry.findAll();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(
      res[1].map((v) => {
        return {
          id: v.getId(),
          teamName: v.getTeamName(),
          members: v.getMembers(),
          isMultiWalk: v.getIsMultiWalk(),
          category: v.getCategory(),
        };
      })
    );
  }

  async delete(id: string): Promise<Option.Option<Error>> {
    const res = await this.deleteService.handle(id);
    if (Option.isSome(res)) {
      return Option.some(res[1]);
    }

    return Option.none();
  }
}
