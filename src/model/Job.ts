import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = mongoose.Schema;
const jobSchema = new schema({
    job_id: {
        type: String,
        required: true,
        unique: true
    },
    service: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Not Specified'
    },
    salary: {
        type: String,
        default: 'Not Specified'
    },
    location: {
        type: String,
        default: 'Not Specified'
    },
    company: {
        type: String,
        default: 'Not Specified'
    },
    title: {
        type: String,
        required: true
    },
    listed: {
        type: String,
        required: true
    }
});

export default mongoose.model('jobs', jobSchema);