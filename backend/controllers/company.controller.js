const { validationResult } = require('express-validator');
const companyService = require('../services/company.service');
const jobModel = require('../models/job.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const studentModel = require('../models/student.model');
const companyModel = require('../models/company.model');

exports.registerCompany = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const company = await companyService.createCompany(req.body);
        const token = company.generateAuthToken();
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginCompany = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const company = await companyModel.findOne({ email }).select('+password');

        if (!company) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await company.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = company.generateAuthToken();
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logoutCompany = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const job = await companyService.createJob(req.body, req.company._id);
        res.status(201).json({ job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCompanyJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalJobs = await jobModel.countDocuments({
            company: req.company._id
        });

        // Fetch only the jobs for the current page
        const jobs = await jobModel.find({ company: req.company._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance

        res.status(200).json({
            jobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            hasMore: page < Math.ceil(totalJobs / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await jobModel.findOne({
            _id: req.params.jobId,
            company: req.company._id
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await jobModel.findOneAndUpdate(
            { _id: req.params.jobId, company: req.company._id },
            req.body,
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await jobModel.findOneAndDelete({
            _id: req.params.jobId,
            company: req.company._id
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Remove job from company's posted jobs
        const company = await companyModel.findById(req.company._id);
        company.postedJobs = company.postedJobs.filter(
            jobId => jobId.toString() !== req.params.jobId
        );
        await company.save();

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await jobModel.findOne({
            _id: jobId,
            company: req.company._id
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const applicants = await studentModel.find({
            appliedJobs: jobId
        }, 'fullname email'); // Only fetch required fields

        res.status(200).json({ applicants });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const company = await companyModel.findById(req.company._id)
            .populate('postedJobs');
        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const company = await companyModel.findByIdAndUpdate(
            req.company._id,
            req.body,
            { new: true }
        );
        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendVerificationOtp = async (req, res) => {
    try {
        const company = req.company;
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

        company.verificationOtp = otp;
        company.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        await company.save();
        companyService.sendOtp(company, otp)

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const company = req.company;
        const { otp } = req.body;

        const fetchedCompany = await companyModel.findById(company._id).select('verificationOtp');
        const companyOtp = fetchedCompany.verificationOtp;

        if (Date.now() > company.otpExpiry) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (companyOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        company.verified = true;
        company.verificationOtp = undefined;
        company.otpExpiry = undefined;
        await company.save();

        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendEmail = async (req, res) => {
    try {
        const company = req.company;
        const body = {
            recipients: req.body.recipients,
            subject: req.body.subject,
            body: req.body.body,
            jobId: req.body.jobId,
            companyName: company.name,
        }
        await companyService.sendEmail(body);
        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
