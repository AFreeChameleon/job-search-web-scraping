import { Request, Response, NextFunction } from "express";
import * as search from '../searchers/searcher'

export const GetResults = (req: Request, res: Response) => {
  return res.render('jobs/search');
}

export const PostSearchJobs = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const jobTitle = req.body.jobTitle,
    location = req.body.location,
    radius = parseInt(req.body.radius)
  const jobs: any = await search.searchAll(jobTitle, location, radius);
  return res.status(200).json({
    jobs: jobs
  });
}