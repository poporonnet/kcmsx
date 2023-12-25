import { Hono } from "hono";
import { GenerateMatchService } from "./service/generate.js";
import { JSONMatchRepository } from "./adaptor/json.js";
import { JSONEntryRepository } from "../entry/adaptor/json.js";
import { MatchController } from "./controller.js";
import { Result } from "@mikuroxina/mini-fn";
import { EditMatchService } from "./service/edit.js";
import { ReconstructMatchArgs } from "./match.js";
import { GetMatchService } from "./service/get.js";

export const matchHandler = new Hono();
const repository = await JSONMatchRepository.new();
const entryRepository = await JSONEntryRepository.new();
const generateService = new GenerateMatchService(entryRepository, repository);
const editService = new EditMatchService(repository);
const getService = new GetMatchService(repository);
const controller = new MatchController(generateService, editService,  getService);

matchHandler.post("/:match", async (c) => {
  const { match } = c.req.param();
  const res = await controller.generateMatch(match);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }]);
  }

  return c.json(res[1]);
});

matchHandler.get("/:type", async (c) => {
  const {type} = c.req.param();
  const res = await controller.getMatchByType(type);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }], 400);
  }
  return c.json(res[1]);
})

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
