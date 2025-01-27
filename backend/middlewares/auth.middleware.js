const studentModel = require('../models/student.model');
const companyModel = require('../models/company.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authStudent = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) {
        res.status(401).json({ message: 'Unauthorized, Token expired!!' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await studentModel.findById(decoded._id);
        req.student = student;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports.authCompany = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized, Token expired!!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await companyModel.findById(decoded._id);

        if (!company) {
            return res.status(401).json({ message: 'Company not found' });
        }

        req.company = company;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
