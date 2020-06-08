import * as indeed from './indeedSearcher/index';
import * as cwjobs from './cwjobsSearcher/index';
import * as totaljobs from './totaljobsSearcher/index'

export const searchAll = async () => {
  const jobIds = {
    'indeed': await indeed.searchIndeed('Web Developer', 'Banbury'),
    'cwjobs': await cwjobs.searchCwjobs('Web Developer', 'Banbury', 30),
    'totaljobs': await totaljobs.searchTotaljobs('Web Developer', 'Banbury', 30)
  }
  return jobIds;
}

console.log(searchAll());