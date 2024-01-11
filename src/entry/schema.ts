import { z } from 'zod';

export const entryRequestSchema = z.object({
  teamName: z.string().min(1).max(100),
  members: z.array(z.string().min(2).max(64)).min(1).max(2),
  isMultiWalk: z.boolean(),
  category: z.enum(['Elementary', 'Open']),
});
