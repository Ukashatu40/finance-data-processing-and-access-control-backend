import { z } from 'zod';

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1),
    date: z.string().datetime(), // ISO 8601
    notes: z.string().optional()
  })
});

export const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional()
  })
});

export const filterRecordSchema = z.object({
  query: z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/, "Page must be a number").transform(Number).optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").transform(Number).optional(),
  })
});
