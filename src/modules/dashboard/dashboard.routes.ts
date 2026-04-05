import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';

const router = Router();

// Everyone who is logged in can view the dashboard
router.use(protect);

router.route('/summary')
  .get(restrictTo('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getSummary);

export default router;
