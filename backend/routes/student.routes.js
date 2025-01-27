const express = require('express');
const { body } = require('express-validator')
const studentController = require('../controllers/student.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('fullname').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], studentController.registerStudent);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], studentController.loginStudent);

router.get('/logout', authMiddleware.authStudentstudentController.logoutStudent);

router.get('/profile', authMiddleware.authStudent, studentController.getProfile);

router.get('/applied-jobs', authMiddleware.authStudent, studentController.getAppliedJobs);

router.post('/apply-job/:jobId', authMiddleware.authStudent, studentController.applyToJob);

router.get('/jobs', authMiddleware.authStudent, studentController.getJobs);

module.exports = router;