import axios from 'axios';
import cheerio from 'cheerio'
import * as util from '../util/index';

export const searchTotaljobs = async (rawJobTitle: string, rawLocation: string, rawRadius: number) => {
  const jobTitle = util.totaljobsSpaceReplacer(rawJobTitle);
  const location = util.totaljobsSpaceReplacer(rawLocation);
  const jobIds: any[] = [];
  const response = await axios.get(`https://www.totaljobs.com/jobs/${jobTitle}/in-${location}?radius=${rawRadius.toString()}&s=header`);
  const $ = cheerio.load(response.data);
  const siteResults = $('.job');
  siteResults.each((index: number, element: any) => {
    jobIds.push({
      'id': $(element).attr('id'),
      'link': $(element).find('.job-title a').attr('href')
    })
  });
  const jobDetails = searchJobsById(jobIds);
  return jobDetails;
}

const searchJobsById = async (jobIds: any[]) => {
  const jobDetails: any = [];
  let $;
  for (let i = 0; i < jobIds.length; i++) {
    await new Promise(next => {
      axios.get(jobIds[i].link)
      .then((res: any) => {
        $ = cheerio.load(res.data);
        jobDetails.push({
          'job_id': jobIds[i].id,
          'title': $('h1.brand-font').text().trim(),
          'salary': $('.salary div').text().trim(),
          'location': $('.location').text().trim().replace('\n           ', ''),
          'type': $('.job-type div').text().trim(),
          'company': $('#companyJobsLink').text(),
          'listed': $('.date-posted').text().trim(),
          'link': jobIds[i].link,
          'service': 'TotalJobs'
        })
        next();
      })
      .catch((err: any) => {
        console.log(`Error at ${jobIds[i].id}. Message: ${err.message}`)
      })
    })
  }
  return jobDetails;
}

export const searchJobContent = async (id: string) => {
  let jobContent: any;
  await new Promise(next => {
    axios.get(`https://www.totaljobs.com/job/${id}`)
      .then((res: any) => {
        const $ = cheerio.load(res.data);
        jobContent = {
          service: 'TotalJobs',
          companyLogo: `https://www.totaljobs.com/${$('.company-logo').attr('src')}`,
          companyLink: `https://www.totaljobs.com${$('#companyJobsLink').attr('href')}`,
          description: $('.job-description').html()?.trim(),
          originalPost: undefined,
          title: $('.col-page-header').text().trim(),
          company: $('#companyJobsLink').text().trim(),
          location: $('.location').text().trim(),
          salary: $('.salary').text().trim(),
          type: $('.job-type').text().trim(),
          listed: $('.date-posted').text().trim()
        }
        console.log(res.data)
        next()
      })
      .catch((err: any) => {
        jobContent = {
          error: true,
          message: err.message
        }
        next()
      })
  })
  return jobContent;
}