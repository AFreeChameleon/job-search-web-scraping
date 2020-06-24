import axios from 'axios';
import cheerio from 'cheerio'
import * as util from '../util/index';
import * as jobFunctions from '../../db/jobFunctions';

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
          'salary': $('.salary div').text().trim() === '' ? 'Not Specified' : $('.salary div').text().trim(),
          'location': $('.location').text().trim().replace('\n           ', '') === '' ? 'Not Specified' : $('.location').text().trim().replace('\n           ', ''),
          'type': $('.job-type div').text().trim() === '' ? 'Not Specified' : $('.job-type div').text().trim(),
          'company': $('#companyJobsLink').text() === '' ? 'Not Specified' : $('#companyJobsLink').text(),
          'listed': $('.date-posted').text().trim() === '' ? 'Not Specified' : $('.date-posted').text().trim(),
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
  // console.log('job details')
  // console.log(jobDetails)
  return jobDetails;
}

export const searchJobContent = async (id: string) => {
  let jobContent: any;
  const DBJobRecord: any = await jobFunctions.FindJobByJobId(id, 'CWJobs');
  if (DBJobRecord.description == null) {
    await new Promise(next => {
      axios.get(`https://www.cwjobs.co.uk/job/${id}`)
        .then((res: any) => {
          const $ = cheerio.load(res.data);
          jobContent = {
            job_id: DBJobRecord.job_id,
            service: DBJobRecord.service,
            companyLogo: `https://www.cwjobs.co.uk/${$('.company-logo').attr('src')}`,
            companyLink: `https://www.cwjobs.co.uk${$('#companyJobsLink').attr('href')}`,
            description: $('.job-description').html()?.replace(new RegExp('</p>', 'g'), '</p><br>'),
            originalPost: '#',
            // title: $('.col-page-header').text().trim(),
            title: DBJobRecord.title,
            // company: $('#companyJobsLink').text().trim(),
            company: DBJobRecord.company,
            // location: $('.location').text().trim(),
            location: DBJobRecord.location,
            // salary: $('.salary').text().trim(),
            salary: DBJobRecord.salary,
            // type: $('.job-type').text().trim(),
            type: DBJobRecord.type,
            // listed: $('.date-posted').text().trim()
            listed: DBJobRecord.listed
          }
          next()
        })
        .catch((err: any) => {
          jobContent = {
            error: true,
            message: err.message
          }
          next()
        })
    });
    jobFunctions.UpdateJob(jobContent);
    return jobContent;
  } else {
    return DBJobRecord;
  }
}