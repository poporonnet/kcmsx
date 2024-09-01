import { zValidator } from "@hono/zod-validator";
import { config } from "config";
import { Hono } from "hono";
import { z } from "zod";
import { matches, teams } from "./data/main";

const RobotTypes = z.enum(config.robotTypes);
const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "kcmsx/mock is up." });
});

app.get("/team", (c) => {
  return c.json({ teams: teams });
});

app.get("/team/:id", (c) => {
  const { id } = c.req.param();

  const team = teams.find((t) => t.id === id);
  if (!team) return c.json({ error: "no team found" }, 400);

  return c.json(team);
});

app.delete("/team/:id", (c) => {
  const { id } = c.req.param();

  const team = teams.find((t) => t.id === id);
  if (!team) return c.json({ error: "no team found" }, 400);

  return c.body(null, 204);
});

// チームの登録
const teamEntrySchema = z.object({
  name: z.string(),
  members: z.array(z.string()),
  clubName: z.string(),
  robotType: RobotTypes,
  category: z.union([z.literal("elementary"), z.literal("open")]),
});
app.post("/team", zValidator("json", teamEntrySchema), (c) => {
  const data = c.req.valid("json");
  // 返ってくる値はだいたい決め打ちします
  return c.json({
    id: "7549586",
    name: data.name,
    entryCode: 2,
    members: data.members,
    clubName: data.clubName,
    robotType: data.robotType,
    category: data.category,
    isEntered: false,
  });
});

app.post("/team/:id/entry", (c) => {
  const { id } = c.req.param();

  const team = teams.find((t) => t.id === id);
  if (!team) return c.json({ error: "no team found" }, 400);

  return c.body(null, 200);
});

app.delete("/team/:id/entry", (c) => {
  const { id } = c.req.param();

  const team = teams.find((t) => t.id === id);
  if (!team) return c.json({ error: "no team found" }, 400);

  return c.body(null, 204);
});

app.get("/match", (c) => {
  return c.json(matches);
});

app.get("/match/:matchType", (c) => {
  const { matchType } = c.req.param();

  if (matchType != "pre" && matchType != "main")
    return c.json({ error: "invalid matchType" }, 400);

  return c.json(matches[matchType]);
});

app.get("/match/:matchType/:id", (c) => {
  const { matchType, id } = c.req.param();

  if (matchType != "pre" && matchType != "main")
    return c.json({ error: "invalid matchType" }, 400);

  const match = matches[matchType].find((m) => m.id === id);
  if (!match) return c.json({ error: "no match found" }, 400);

  return c.json(match);
});

// 本来は違うけど~~めんどくさいから~~とりあえずこうした
app.post("/match/:matchType/:departmentType/generate", (c) => {
  const { matchType, departmentType } = c.req.param();

  if (matchType != "pre" && matchType != "main")
    return c.json({ error: "invalid matchType" }, 400);
  if (departmentType != "elementary" && departmentType != "open")
    return c.json({ error: "invalid departmentType" }, 400);
  return c.json(matches[matchType]);
});

app.get("/match/:matchType/:id/run_result", (c) => {
  const { matchType, id } = c.req.param();

  if (matchType != "pre" && matchType != "main")
    return c.json({ error: "invalid matchType" }, 400);

  const match = matches[matchType].find((m) => m.id === id);
  if (!match) return c.json({ error: "no match found" }, 400);
  return c.json(match.runResults);
});

const MatchResultSchema = z.array(
  z.object({
    id: z.string(),
    teamID: z.string(),
    points: z.number(),
    goalTimeSeconds: z.union([z.number(), z.null()]),
    finishState: z.enum(["retired", "finished"]),
  })
);
app.post(
  "/match/:matchType/:id/run_result",
  zValidator("json", MatchResultSchema),
  (c) => {
    const { matchType, id } = c.req.param();
    if (matchType != "pre" && matchType != "main")
      return c.json({ error: "invalid matchType" }, 400);

    const match = matches[matchType].find((m) => m.id === id);
    if (!match) return c.json({ error: "no match found" }, 400);
    return c.json(c.req.valid("json"), 200);
  }
);

app.get("/sponsor", (c) => {
  return c.json({
    name: "Poporon Network",
    class: "Gold",
    url: "https://github.com/poporonnet.png",
  });
});
export default app;
