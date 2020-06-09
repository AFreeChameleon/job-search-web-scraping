import axios from 'axios';
import cheerio from 'cheerio';
import * as qs from 'querystring';
import * as util from '../util/index';
import fs from 'fs';

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
  const jobDetails = await searchJobsById(jobIds);
  return jobDetails;
}

const searchJobsById = (jobIds: string[]) => {
  const jobDetails: any = [];
  jobIds.forEach(async (id: string) => {
    axios.get(`https://www.indeed.co.uk/viewjob?jk=${id}&from=vjs&vjs=1`)
    .then((res: any) => {
      jobDetails.push({
        'id': id,
        'jobTitle': res.data.jobTitle,
        'salary': res.data.ssT,
        'location': res.data.jobLocationModel.jobLocation,
        'type': res.data.jtsT,
        'link': util.indeedJSONLinkFormatter(res.data.copyJobLink),
        'company': res.data.sicm.cmN,
        'timeListed': res.data.vfvm.jobAgeRelative
      })
    })
    .catch((err: any) => {
      console.log(`error at ${id}: ${err.message}`)
    })
  });
  return jobDetails;
}