const axios = require('axios');
const cheerio = require('cheerio');
const util = require('../util/index');

export const searchIndeed = async (rawJobTitle: string, rawLocation: string) => {
  const jobTitle: string = util.indeedSpaceReplacer(rawJobTitle)
  const jobIds: any = [];
  const response = await axios.get(`https://www.indeed.co.uk/jobs?q=${jobTitle}&l=${rawLocation}`)
  const $ = cheerio.load(response.data)
  const siteResults = $('.result');
  siteResults.each((index: any, element: any) => {
    jobIds.push($(element).attr('data-jk'))
  })
  return jobIds;
}