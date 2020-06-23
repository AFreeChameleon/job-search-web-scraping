import { Request, Response, NextFunction } from "express";
import * as search from '../searchers/searcher'

export const GetResults = (req: Request, res: Response) => {
  const jobTitle = (req.query as any).jobTitle,
    location = (req.query as any).location,
    radius = parseInt((req.query as any).radius);
  return res.redirect(`/jobs/results?location=${location}&jobTitle=${jobTitle}&radius=${radius}`);
}

export const GetSearchJobs = async (req: Request, res: Response, next: NextFunction) => {
  const jobTitle = (req.query as any).jobTitle,
    location = (req.query as any).location,
    radius = parseInt((req.query as any).radius);
  // const jobs: any = await search.searchAll(jobTitle, location, radius);
  const jobs: any = [];
  return res.render('jobs/results', {
    jobTitle,
    location,
    radius,
    jobs: jobs
  });
}

export const GetJobPosting = async (req: Request, res: Response) => {
  const service = req.params.service,
    id = req.params.id;
  console.log(service)
  console.log(id)
  const jobContent: any = await search.searchJobPosting(service, id);
  console.log(jobContent)
  if (jobContent.error) {
    console.log(jobContent.message);
    return res.redirect('back')
  } else {
    return res.render('jobs/jobpost', {
      content: jobContent,
      jobTitle: '',
      location: '',
      radius: ''
    });
  }
}