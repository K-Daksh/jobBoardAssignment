const express = require('express');
const { body } = require('express-validator')
const studentController = require('../controllers/student.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('fullname').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    studentController.registerStudent(req, res);
});

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    studentController.loginStudent(req, res);
});

router.get('/logout', authMiddleware.authStudent, (req, res) => {
    studentController.logoutStudent(req, res);
});

router.get('/profile', authMiddleware.authStudent, (req, res) => {
    studentController.getProfile(req, res);
});

router.get('/applied-jobs', authMiddleware.authStudent, (req, res) => {
    studentController.getAppliedJobs(req, res);
});

router.post('/apply-job/:jobId', authMiddleware.authStudent, (req, res) => {
    studentController.applyToJob(req, res);
});

router.get('/jobs', authMiddleware.authStudent, (req, res) => {
    studentController.getJobs(req, res);
});

module.exports = router;