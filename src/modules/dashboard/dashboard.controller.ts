import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

export const getSummary = async (req: Request, res: Response) => {
  const cacheKey = "dashboard_summary";
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({ status: 'success', data: cachedData, cached: true });
  }

  const summary = await dashboardService.getDashboardSummary();
  cache.set(cacheKey, summary);
  res.status(200).json({ status: 'success', data: summary });
};
