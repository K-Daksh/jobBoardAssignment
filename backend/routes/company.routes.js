const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/company.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// Auth routes
router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('companyname').isLength({ min: 3 }).withMessage('Company name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('mobile').isMobilePhone().withMessage('Please enter a valid mobile number')
], companyController.registerCompany);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], companyController.loginCompany);

router.get('/logout', authMiddleware.authCompany, companyController.logoutCompany);

// OTP verification routes
router.post('/send-verification', authMiddleware.authCompany, companyController.sendVerificationOtp);
router.post('/verify-otp', authMiddleware.authCompany, companyController.verifyOtp);

// Job management routes
router.post('/jobs', authMiddleware.authCompany, [
    body('title').notEmpty().withMessage('Job title is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('experienceLevel').isIn(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).withMessage('Invalid experience level'),
    body('endDate').isISO8601().withMessage('Invalid end date')
], companyController.createJob);

router.get('/jobs', authMiddleware.authCompany, companyController.getCompanyJobs);

router.get('/jobs/:jobId', authMiddleware.authCompany, companyController.getJobById);

router.get('/jobs/:jobId/applicants', authMiddleware.authCompany, companyController.getJobApplicants);

router.put('/jobs/:jobId', authMiddleware.authCompany, companyController.updateJob);

router.delete('/jobs/:jobId', authMiddleware.authCompany, companyController.deleteJob);

// Company profile routes
router.get('/profile', authMiddleware.authCompany, companyController.getProfile);

router.put('/profile', authMiddleware.authCompany, companyController.updateProfile);

router.post('/send-email', authMiddleware.authCompany, companyController.sendEmail);

module.exports = router;
