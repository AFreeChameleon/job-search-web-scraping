import { Request, Response, NextFunction } from 'express';
import User from '../model/User';
import passport from 'passport';
import flash from 'connect-flash';
import { ConfirmEmail } from '../email/email';

export function loggedOut(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

export function loggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  return next();
}

function validatePassword(password: string) {
  const errors = [];
  if (password.length < 8) {
      errors.push("Your password must be at least 8 characters"); 
  }
  if (password.search(/[a-z]/i) < 0) {
      errors.push("Your password must contain at least one letter.");
  }
  if (password.search(/[0-9]/) < 0) {
      errors.push("Your password must contain at least one digit."); 
  }
  if (errors.length > 0) {
      return errors;
  }
  return false;
}

export const GetLogin = (req: Request, res: Response) => {
  return res.render('account/login')
}

export const GetRegister = (req: Request, res: Response) => {
  res.render('account/register');
}

export const PostLogin = (req: Request, res: Response) => {
  res.redirect('/dashboard')
}

export const PostRegister = (req: Request, res: Response) => {
  const username = req.body.username,
    email = req.body.email,
    password = req.body.password
  if (password !== req.body.confirmpassword) {
    return res.status(401).json({
      message: 'Passwords don\'t match'
    })
  }
  if (validatePassword(password)) {
    return res.status(500).json({
      message: 'Password not valid',
      errors: validatePassword(password)
    });
  }
  User.findOne({
    email: email
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Database error, please try again'
      })
    } else if (data) {
      return res.status(500).json({
        message: 'User with that email already exists'
      });
    } else {
      const record: any = new User();
      record.username = username;
      record.email = email;
      record.password = record.hashPassword(password);
      record.save((err: any, user: any) => {
        if (err) {
          return res.status(500).json({
            message: 'Database error, please try again'
          })
        } else {
          // Make PHP email API to send emails
          // ConfirmEmail(email);
          return res.redirect('/login');
        }
      });
    }
  })
}

export const GetLogout = (req: Request, res: Response) => {
  req.logout();
  return res.redirect('/');
}

export const GetDashboard = (req: Request, res: Response) => {
  console.log(req.user)
  res.render('account/dashboard');
}