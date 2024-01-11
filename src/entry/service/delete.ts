import { EntryRepository } from '../repository.js';
import { Option } from '@mikuroxina/mini-fn';

export class DeleteEntryService {
  private readonly repository: EntryRepository;

  constructor(repository: EntryRepository) {
    this.repository = repository;
  }

  async handle(id: string): Promise<Option.Option<Error>> {
    const res = await this.repository.delete(id);
    if (Option.isSome(res)) {
      return Option.some(res[1]);
    }
    return Option.none();
  }
}
