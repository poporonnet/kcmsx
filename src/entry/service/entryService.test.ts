import {describe, expect, it} from "vitest";
import {DummyRepository} from "../adaptor/dummyRepository.js";
import {EntryService} from "./entryService.js";
import {Entry} from "../entry.js";
import {Result} from "@mikuroxina/mini-fn";

describe("entryService", () => {
    const repository = new DummyRepository();
    const service = new EntryService(repository);

    it("エントリーできる",async () => {
        const entry = Entry.new({
            id: "123",
            teamName: "team1",
            members: ["山田四十郎","石田四成"],
            isMultiWalk: true,
            category: "Open"
        });
        const actual = await service.create(entry);

        expect(Result.isOk(actual)).toBe(true);
        expect(actual[1]).toBe(entry)

    });
})
