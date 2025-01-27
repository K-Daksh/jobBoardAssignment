const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');
const studentService = require('../services/student.service');
const studentModel = require('../models/student.model');
const jobModel = require('../models/job.model');

module.exports.registerStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { fullname, email, password } = req.body;
        const isUserAlreadyExist = await studentModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exist' });
        }
        const hashedPassword = await studentModel.hashPassword(password);
        const student = await studentService.createStudent({ fullname, email, password: hashedPassword });
        const token = student.generateAuthToken();
        console.log(token);
        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports.loginStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await studentModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);
    console.log(user);

    res.status(200).json({ user: user, token: token });
}

module.exports.logoutStudent = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    const blackToken = await blacklistTokenModel.create({ token: token });
    blackToken.save();
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports.getProfile = async (req, res, next) => {
    try {
        var student = req.student;
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ student: student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAppliedJobs = async (req, res) => {
    try {
        const student = req.student;
        const appliedJobs = await jobModel.find({
            _id: { $in: student.appliedJobs }
        });
        res.status(200).json({ jobs: appliedJobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find({ _id: { $nin: req.student.appliedJobs } });
        res.status(200).json({ jobs: jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.applyToJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const student = req.student;

        // Check if already applied
        if (student.appliedJobs.includes(jobId)) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Add job to student's applied jobs
        student.appliedJobs.push(jobId);
        await student.save();

        // Add student's email to job's candidates
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.candidates.push(student.email);
        await job.save();

        res.status(200).json({ message: 'Successfully applied to job' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};