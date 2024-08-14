import { Hono } from "hono";
import { matches, teams } from "./data/main";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "kcmsx/mock is up." });
});

app.get("/team", (c) => {
  return c.json(teams);
});

app.get("/team/:id", (c) => {
  const { id } = c.req.param();

  const team = teams.find((t) => t.id === id);
  if (!team) return c.json({ error: "no team found" }, 400);

  return c.json(team);
});

app.get("/match", (c) => {
  return c.json(matches);
});

app.get("/match/:matchType/:id", (c) => {
  const { matchType, id } = c.req.param();

  if (matchType != "pre" && matchType != "main")
    return c.json({ error: "invalid matchType" }, 400);

  const match = matches[matchType].find((m) => m.id === id);
  if (!match) return c.json({ error: "no match found" }, 400);

  return c.json(match);
});

export default app;
