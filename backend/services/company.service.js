const companyModel = require('../models/company.model');
const jobModel = require('../models/job.model');
const https = require('https');
const emailConfig = require('../config/email.config');
const emailjs = require('@emailjs/nodejs');
require('dotenv').config();

module.exports.createCompany = async (companyData) => {
    const { companyname, email, password, mobile } = companyData;

    const existingCompany = await companyModel.findOne({ email });
    if (existingCompany) {
        throw new Error('Company already exists');
    }

    const hashedPassword = await companyModel.hashPassword(password);
    const company = new companyModel({
        name: companyname,
        email,
        password: hashedPassword,
        mobile
    });

    await company.save();
    return company;
}

const sendAllUpdate = async (job) => {
    try {
        const recipients = job.emails;
        const companyName = await companyModel.findById(job.company);

        const emailPromises = recipients.map(recipient => {
            const templateParams = {
                to_name: recipient.split('@')[0],
                to_email: recipient,
                subject: `New Job Opportunity: ${job.title} at ${companyName.name}`,
                custom_message: `A new job opportunity has been posted for position ${job.title}. Apply now!
                
                Job Description: ${job.description}
                Experience Level: ${job.experienceLevel}

                `,
                company_name: companyName.name,
                job_title: job.title,
            };

            return emailjs.send(
                process.env.EMAIL_SERVICE_ID,
                process.env.EMAIL_TEMPLATE_ID,
                templateParams,
                {
                    publicKey: process.env.EMAIL_PUBLIC_KEY,
                    privateKey: process.env.EMAIL_PRIVATE_KEY,
                }
            );
        });

        await Promise.all(emailPromises);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        // throw new Error('Failed to send emails');
    }
}

module.exports.createJob = async (jobData, companyId) => {
    const job = new jobModel({
        ...jobData,
        company: companyId
    });

    await job.save();

    // Add job to company's posted jobs
    sendAllUpdate(job);

    const company = await companyModel.findById(companyId);
    company.postedJobs.push(job._id);
    await company.save();

    return job;
}

const sendEmailRequest = (data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.emailjs.com',
            path: '/api/v1.0/email/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(responseData);
                } else {
                    reject(new Error(`EmailJS request failed with status ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
};

module.exports.sendEmail = async (emailData) => {
    const { recipients, subject, body, jobId, companyName } = emailData;

    try {
        const job = await jobModel.findById(jobId);
        if (!job) throw new Error('Job not found');

        const emailPromises = recipients.map(recipient => {
            const templateParams = {
                to_name: recipient.split('@')[0],
                to_email: recipient,
                subject: subject,
                custom_message: body,
                company_name: companyName,
                job_title: job.title,
                application_date: new Date().toLocaleDateString(),
                contact_email: process.env.CONTACT_EMAIL
            };

            return emailjs.send(
                process.env.EMAIL_SERVICE_ID,
                process.env.EMAIL_TEMPLATE_ID,
                templateParams,
                {
                    publicKey: process.env.EMAIL_PUBLIC_KEY,
                    privateKey: process.env.EMAIL_PRIVATE_KEY,
                }
            );
        });

        await Promise.all(emailPromises);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send emails');
    }
};


module.exports.sendOtp = async (company) => {
    try {

        const templateParams = {
            to_name: company.name,
            to_email: company.email,
            subject: `OTP for ${company.name}`,
            otp_code: company.verificationOtp,
        };

        return emailjs.send(
            process.env.EMAIL_SERVICE_ID,
            process.env.OTP_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAIL_PUBLIC_KEY,
                privateKey: process.env.EMAIL_PRIVATE_KEY,
            }
        );
    } catch (error) {
        console.error('OTP sending failed:', error);
        throw new Error('Failed to send OTP');
    }
};