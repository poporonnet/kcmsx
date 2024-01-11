import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { entryRequestSchema } from './schema.js';
import { Controller } from './controller.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { JSONEntryRepository } from './adaptor/json.js';

export const entryHandler = new Hono();
// export const controller = new Controller(new DummyRepository());
export const controller = new Controller(await JSONEntryRepository.new());

entryHandler.post('/', zValidator('json', entryRequestSchema), async (c) => {
  const { teamName, members, isMultiWalk, category } = c.req.valid('json');

  const res = await controller.create({
    teamName,
    members,
    isMultiWalk,
    category,
  });
  if (Result.isErr(res)) {
    return c.json({ error: res[1].message }, 400);
  }

  return c.json({
    id: res[1].id,
    teamName: res[1].teamName,
    members: res[1].members,
    isMultiWalk: res[1].isMultiWalk,
    category: res[1].category,
  });
});

entryHandler.get('/', async (c) => {
  const res = await controller.get();
  if (Result.isErr(res)) {
    return c.json({ error: res[1].message }, 400);
  }

  return c.json([...res[1]]);
});

entryHandler.delete('/:id', async (c) => {
  const res = await controller.delete(c.req.param().id);
  if (Option.isSome(res)) {
    return c.json({ error: res[1].message }, 400);
  }
  return new Response(null, { status: 204 });
});
