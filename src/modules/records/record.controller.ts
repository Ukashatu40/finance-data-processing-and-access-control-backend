import { Request, Response } from 'express';
import * as recordService from './record.service';

export const createRecord = async (req: Request, res: Response) => {
  // req.user is guaranteed by protect middleware
  const result = await recordService.createRecord(req.body, req.user.id);
  res.status(201).json({ status: 'success', data: result });
};

export const getAllRecords = async (req: Request, res: Response) => {
  const result = await recordService.getRecords(req.query);
  res.status(200).json({ status: 'success', data: result.data, meta: result.meta });
};

export const updateRecord = async (req: Request, res: Response) => {
  const result = await recordService.updateRecord(req.params.id as string, req.body);
  res.status(200).json({ status: 'success', data: result });
};

export const deleteRecord = async (req: Request, res: Response) => {
  await recordService.deleteRecord(req.params.id as string);
  res.status(204).send();
};
