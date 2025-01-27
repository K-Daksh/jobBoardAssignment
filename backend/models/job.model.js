const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true
    },
    experienceLevel: {
        type: String,
        enum: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'],
        required: [true, 'Experience level is required']
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    candidates: [{
        type: String,  // Store email addresses
        trim: true
    }],
    emails: [{
        type: String,  // Store email addresses of emails to be updated
    }],
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;
