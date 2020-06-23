import axios from 'axios';
import cheerio from 'cheerio'
import * as util from '../util/index';

export const searchCwjobs = async (rawJobTitle: string, rawLocation: string, rawRadius: number) => {
  const jobTitle = util.cwjobsSpaceReplacer(rawJobTitle);
  const location = util.cwjobsSpaceReplacer(rawLocation);
  const jobIds: any = [];
  const response = await axios.get(`https://www.cwjobs.co.uk/jobs/${jobTitle}/in-${location}?radius=${rawRadius.toString()}&s=header`);
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
  const jobDetails: any[] = [];
  let $;
  for (let i = 0; i < jobIds.length; i++) {
    await new Promise(next => {
      axios.get(jobIds[i].link)
      .then((res: any) => {
        $ = cheerio.load(res.data);
        jobDetails.push({
          'job_id': jobIds[i].id,
          'title': $('.col-page-header h1').text().trim(),
          'salary': $('.salary div').text().trim(),
          'location': $('.location').text().trim().replace('\n           ', ''),
          'type': $('.job-type div').text().trim(),
          'company': $('#companyJobsLink').text(),
          'listed': $('.date-posted').text().trim(),
          'link': jobIds[i].link,
          'service': 'CWJobs'
        })
        next();
      })
      .catch((err: any) => {
        console.log(`Error at ${jobIds[i].id}. Message: ${err.message}`)
      })
    })
  }
  console.log('job details')
  console.log(jobDetails)
  return jobDetails;
}

export const searchJobContent = async (id: string) => {
  let jobContent: any;
  await new Promise(next => {
    axios.get(`https://www.cwjobs.co.uk/job/${id}`)
      .then((res: any) => {
        const $ = cheerio.load(res.data);
        jobContent = {
          service: 'CWJobs',
          companyLogo: `https://www.cwjobs.co.uk/${$('.company-logo').attr('src')}`,
          companyLink: `https://www.cwjobs.co.uk${$('#companyJobsLink').attr('href')}`,
          description: $('.job-description').html()?.replace(new RegExp('</p>', 'g'), '</p><br>'),
          originalPost: '#',
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