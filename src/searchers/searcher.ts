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
  return jobs;
}

export const searchJobPosting = async (service: string, id: string) => {
  switch (service) {
    case 'Indeed':
      indeed.searchJobContent(id);
    case 'CWJobs':
      cwjobs.searchJobContent(id);
    case 'TotalJobs':
      totaljobs.searchJobContent(id);
  }
}

export const jobSorter = async () => {
  
}