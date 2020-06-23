import axios from 'axios';
import cheerio from 'cheerio';
import * as util from '../util/index';
import * as fs from 'fs';

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
          'job_id': jobIds[i],
          'title': res.data.jobTitle,
          'salary': res.data.ssT,
          'location': res.data.jobLocationModel.jobLocation,
          'type': res.data.jtsT,
          'link': util.indeedJSONLinkFormatter(res.data.copyJobLink),
          'company': res.data.sicm.cmN,
          'listed': res.data.vfvm.jobAgeRelative,
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

export const searchJobContent = async (id: string) => {
  let jobContent: any;
  await new Promise(next => {
    axios.get(`https://www.indeed.co.uk/viewjob?jk=${id}`)
      .then((res: any) => {
        const $ = cheerio.load(res.data);
        jobContent = {
          service: 'Indeed',
          companyLogo: '#',
          companyLink: '#',
          description: $('#jobDescriptionText').html()?.replace(new RegExp('</p>', 'g'), '</p><br>'),
          originalPost: `https://indeed.co.uk/rc/clk?jk=${id}&amp;from=vj&amp;pos=twoPaneCopyLink`,
          title: $('.jobsearch-JobInfoHeader-title').text(),
          company: $('.jobsearch-CompanyInfoWithoutHeaderImage').text().trim(),
          location: $('.icl-IconFunctional--location').next().text(),
          salary: $('.icl-IconFunctional--salary').html(),
          type: $('.icl-IconFunctional--jobs').next().text(),
          listed: $('.jobsearch-JobMetadataFooter').html()?.split('<')[0].replace(' - ', ''),
        }
        next();
      })
      .catch((err: any) => {
        jobContent = {
          error: true,
          message: err.message
        }
        next()
      })
  });
  return jobContent;
}