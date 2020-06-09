import * as indeed from './indeedSearcher/index';
import * as cwjobs from './cwjobsSearcher/index';
import * as totaljobs from './totaljobsSearcher/index'

export const searchAll = async (jobTitle: string, location: string, radius: number) => {
  const jobIds = {
    'indeed': await indeed.searchIndeed(jobTitle, location),
    'cwjobs': await cwjobs.searchCwjobs(jobTitle, location, radius),
    'totaljobs': await totaljobs.searchTotaljobs(jobTitle, location, radius)
  }
  return jobIds;
}