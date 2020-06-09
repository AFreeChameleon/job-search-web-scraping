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

function validateForm(username: string, email: string, password: string, confirmpassword: string) {
  const errors: any = [];
  if (password !== confirmpassword) {
    errors.push('Passwords don\'t match.');
  }
  if (!(username && email && password && confirmpassword)) {
    errors.push('Please fill in empty fields.')
  }
  if (password.length < 8) {
    errors.push("Your password must be at least 8 characters"); 
  }
  if (password.search(/[a-z]/i) < 0) {
    errors.push("Your password must contain at least one letter.");
  }
  if (password.search(/[0-9]/) < 0) {
    errors.push("Your password must contain at least one digit."); 
  }
  return errors;
}

export const GetLogin = (req: Request, res: Response) => {
  return res.render('account/login')
}

export const GetRegister = (req: Request, res: Response) => {
  res.render('account/register');
}

export const PostRegister = (req: Request, res: Response) => {
  const username = req.body.username,
    email = req.body.email,
    password = req.body.password,
    confirmpassword = req.body.confirmpassword;
  const formErrors = validateForm(username, email, password, confirmpassword)
  console.log(formErrors);
  if (formErrors.length > 0) {
    return res.status(500).json({
      message: 'Password not valid',
      errors: formErrors
    });
  }
  User.findOne({
    username: username,
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Database error, please try again'
      })
    } else if (data) {
      return res.status(500).json({
        message: 'User with that username already exists'
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