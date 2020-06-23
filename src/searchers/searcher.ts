import * as indeed from './indeedSearcher/index';
import * as cwjobs from './cwjobsSearcher/index';
import * as totaljobs from './totaljobsSearcher/index'

export const searchAll = async (jobTitle: string, location: string, radius: number) => {
  let jobs: any[] = [];
  jobs = (
    await indeed.searchIndeed(jobTitle, location)).concat(
    await cwjobs.searchCwjobs(jobTitle, location, radius)).concat(
    await totaljobs.searchTotaljobs(jobTitle, location, radius)
  )
  return jobRandomiser(jobs);
}

export const searchJobPosting = async (service: string, id: string) => {
  let jobDetails: any;
  switch (service) {
    case 'Indeed':
      jobDetails = indeed.searchJobContent(id);
      break;
    case 'CWJobs':
      jobDetails = cwjobs.searchJobContent(id);
      break;
    case 'TotalJobs':
      jobDetails = totaljobs.searchJobContent(id);
      break;
    default:
      jobDetails = {
        error: true,
        message: 'Service does not match'
      }
      break;
  }
  return jobDetails;
}

export const jobRandomiser = async (jobList: any[]) => {
  for(let i = jobList.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = jobList[i]
    jobList[i] = jobList[j]
    jobList[j] = temp
  }
  return jobList;
}