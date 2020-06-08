import { Request, Response, NextFunction } from "express";
import * as search from '../searchers/searcher'

export const GetSearchJobs = (req: Request, res: Response) => {
  return res.render('jobs/search');
}

export const PostSearchJobs = (req: Request, res: Response, next: NextFunction) => {
  const jobs: any = search.searchAll();
  return res.status(200).json({
    jobs: jobs
  });
}