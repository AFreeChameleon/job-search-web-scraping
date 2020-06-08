import { Router } from 'express';
import * as homeController from '../controllers/home';
import passport from 'passport';
export const router: Router = Router();

//Routes
router.get('/', homeController.GetHome);