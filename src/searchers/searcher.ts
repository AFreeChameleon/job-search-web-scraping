import * as indeed from './indeedSearcher/index';
import * as cwjobs from './cwjobsSearcher/index';
import * as totaljobs from './totaljobsSearcher/index'

export const searchAll = async (jobTitle: string, location: string, radius: number) => {
  let jobs: any[] = [
    // await indeed.searchIndeed(jobTitle, location), 
    // await cwjobs.searchCwjobs(jobTitle, location, radius), 
    // await totaljobs.searchTotaljobs(jobTitle, location, radius)
  ];
  jobs = (
    await indeed.searchIndeed(jobTitle, location)).concat(
    await cwjobs.searchCwjobs(jobTitle, location, radius)).concat(
    await totaljobs.searchTotaljobs(jobTitle, location, radius)
  )
  // const jobIds = {
  //   'indeed': await indeed.searchIndeed(jobTitle, location),
  //   'cwjobs': await cwjobs.searchCwjobs(jobTitle, location, radius),
  //   'totaljobs': await totaljobs.searchTotaljobs(jobTitle, location, radius)
  // }
  return jobs;
}

export const jobSorter = async () => {
  
}