import { Request, Response, NextFunction } from 'express';

export const GetHome = (req: Request, res: Response) => {
  return res.render('home/index', {
    title: '',
    location: '',
    radius: ''
  })
}