import { Router } from 'express';
import * as recordController from './record.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createRecordSchema, filterRecordSchema, updateRecordSchema } from './record.schema';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';

const router = Router();

// Protect all record routes
router.use(protect);

router.route('/')
  .post(restrictTo('ADMIN'), validate(createRecordSchema), recordController.createRecord)
  .get(restrictTo('ADMIN', 'ANALYST'), validate(filterRecordSchema), recordController.getAllRecords);

router.route('/:id')
  .put(restrictTo('ADMIN'), validate(updateRecordSchema), recordController.updateRecord)
  .delete(restrictTo('ADMIN'), recordController.deleteRecord);

export default router;
