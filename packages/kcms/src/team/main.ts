import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { bulkEntryRequestSchema, entryRequestSchema } from './schema.js';
import { Controller } from './controller.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { errorToCode } from './adaptor/errors.js';
import { DummyRepository } from './adaptor/dummyRepository';

export const entryHandler = new Hono();
export const controller = new Controller(new DummyRepository());

entryHandler.post('/', zValidator('json', entryRequestSchema), async (c) => {
  const { teamName, members, isMultiWalk, category } = c.req.valid('json');

  const res = await controller.create({
    teamName,
    members,
    isMultiWalk,
    category,
  });
  if (Result.isErr(res)) {
    return c.json({ error: errorToCode(res[1]) }, 400);
  }

  return c.json({
    id: res[1].id,
    teamName: res[1].teamName,
    members: res[1].members,
    isMultiWalk: res[1].isMultiWalk,
    category: res[1].category,
  });
});

entryHandler.post('/bulk', zValidator('json', bulkEntryRequestSchema), async (c) => {
  const data = c.req.valid('json');

  const response: {
    id: string;
    teamName: string;
    members: string[];
    isMultiWalk: boolean;
    category: 'open' | 'elementary';
  }[] = [];

  for (const v of data) {
    const res = await controller.create({
      teamName: v.teamName,
      members: v.members,
      isMultiWalk: v.isMultiWalk,
      category: v.category,
    });
    if (Result.isErr(res)) {
      return c.json({ error: errorToCode(res[1]) }, 400);
    }
    const unwrapped = Result.unwrap(res);
    response.push({
      id: unwrapped.id,
      teamName: unwrapped.teamName,
      members: unwrapped.members,
      isMultiWalk: unwrapped.isMultiWalk,
      category: unwrapped.category === 'open' ? 'open' : 'elementary',
    });
  }

  return c.json(response, 200);
});

entryHandler.get('/', async (c) => {
  const res = await controller.get();
  if (Result.isErr(res)) {
    return c.json({ error: errorToCode(res[1]) }, 400);
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
