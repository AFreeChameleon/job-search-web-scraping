import { Router } from 'express';
import * as jobController from '../controllers/job';
export const router: Router = Router();

//Routes
router.get('/', jobController.GetSearchJobs);