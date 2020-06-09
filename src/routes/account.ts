import { Router } from 'express';
import * as accountController from '../controllers/account';
import passport from 'passport';
export const router: Router = Router();

//Routes
router.get('/login', accountController.loggedIn, accountController.GetLogin);

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/'
}));

router.get('/register', accountController.GetRegister);
router.post('/register', accountController.PostRegister);

router.get('/logout', accountController.loggedOut, accountController.GetLogout);