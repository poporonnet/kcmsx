import { Hono } from "hono";
import { GenerateMatchService } from "./service/generate.js";
import { JSONMatchRepository } from "./adaptor/json.js";
import { JSONEntryRepository } from "../entry/adaptor/json.js";
import { MatchController } from "./controller.js";
import { Result } from "@mikuroxina/mini-fn";
import { EditMatchService } from "./service/edit.js";
import { ReconstructMatchArgs } from "./match.js";

export const matchHandler = new Hono();
const repository = await JSONMatchRepository.new();
const entryRepository = await JSONEntryRepository.new();
const generateService = new GenerateMatchService(entryRepository, repository);
const editService = new EditMatchService(repository);
const controller = new MatchController(generateService, editService);

matchHandler.post("/:match", async (c) => {
  const { match } = c.req.param();
  const res = await controller.generateMatch(match);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }]);
  }

  return c.json(res[1]);
});

matchHandler.put("/:match", async (c) => {
  const { match } = c.req.param();
  const req = (await c.req.json()) as Required<
    Pick<ReconstructMatchArgs, "results">
  >;
  if (!req.results) {
    return c.json([{ error: "results is required" }], 400);
  }

  const res = await controller.editMatch(match, req);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }]);
  }

  return c.json(res[1]);
});
