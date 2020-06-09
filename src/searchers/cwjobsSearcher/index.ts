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
    jobIds.push($(element).attr('id'))
  });
  return jobIds;
}