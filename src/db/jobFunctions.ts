import Job from '../model/Job';

export const addToDB = async (jobList: any[]) => {
    Job.insertMany(jobList, { ordered: false }).catch(err => console.log(err.message))
}

export const FindJobByJobId = async (job_id: string, service: string) => {
    const job: any = await Job.findOne({
        job_id,
        service
    });
    return job;
}

export const UpdateJob = async (job: any) => {
    try {
        Job.findOne({
            job_id: job.job_id,
            service: job.service
        })
        .then((record: any) => {
            console.log(record)
            record.description = job.description;
            record.companyLogo = job.companyLogo;
            record.companyLink = job.companyLink;
            record.originalPost = job.originalPost;
            record.save();
        })
        .catch((err) => {
            console.log(err.message)
        });
        return 0;
    } catch (err) {
        console.log('UpdateJob error: ' + err.message);
        return 1;
    }
}