import { Hono } from "hono";
import { GenerateMatchService } from "./service/generate.js";
import { JSONMatchRepository } from "./adaptor/json.js";
import { JSONEntryRepository } from "../entry/adaptor/json.js";
import { MatchController } from "./controller.js";
import { Result } from "@mikuroxina/mini-fn";
export const matchHandler = new Hono();
const repository = await JSONMatchRepository.new();
const entryRepository = await JSONEntryRepository.new();
const generateService = new GenerateMatchService(entryRepository, repository);
const controller = new MatchController(generateService);

matchHandler.post("/:match", async (c) => {
  const { match } = c.req.param();
  const res = await controller.generateMatch(match);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }]);
  }

  return c.json(res[1]);
});
