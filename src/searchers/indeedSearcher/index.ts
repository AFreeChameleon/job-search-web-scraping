import axios from 'axios';
import cheerio from 'cheerio';
import * as util from '../util/index';

export const searchIndeed = async (rawJobTitle: string, rawLocation: string) => {
  const jobTitle: string = util.indeedSpaceReplacer(rawJobTitle)
  const jobIds: any = [];
  const response = await axios.get(`https://www.indeed.co.uk/jobs?q=${jobTitle}&l=${rawLocation}`)
  const $ = cheerio.load(response.data)
  const siteResults = $('.result');
  siteResults.each((index: number, element: any) => {
    jobIds.push($(element).attr('data-jk'))
  })
  console.log('jobIds: ')
  console.log(jobIds)
  const jobDetails = searchJobsById(jobIds);
  return jobDetails;
}

const searchJobsById = async (jobIds: string[]) => {
  const jobDetails: any = [];
  for (let i = 0; i < jobIds.length; i++) {
    await new Promise(next => {
      axios.get(`https://www.indeed.co.uk/viewjob?jk=${jobIds[i]}&from=vjs&vjs=1`)
      .then((res: any) => {
        jobDetails.push({
          'id': jobIds[i],
          'jobTitle': res.data.jobTitle,
          'salary': res.data.ssT,
          'location': res.data.jobLocationModel.jobLocation,
          'type': res.data.jtsT,
          'link': util.indeedJSONLinkFormatter(res.data.copyJobLink),
          'company': res.data.sicm.cmN,
          'timeListed': res.data.vfvm.jobAgeRelative,
          'service': 'Indeed'
        })
        next();
      })
      .catch((err: any) => {
        console.log(`Error at ${jobIds[i]}. Message: ${err.message}`)
      })
    })
  }
  return jobDetails;
}