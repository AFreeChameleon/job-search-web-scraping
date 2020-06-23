import Job from '../model/Job';

export const addToDB = async (jobList: any[]) => {
    Job.insertMany(jobList).catch(err => console.log(err.message))
}