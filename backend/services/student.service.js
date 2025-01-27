const studentModel = require('../models/student.model');

module.exports.createStudent = async ({ fullname, email, password }) => {
    if (!fullname || !email || !password) {
        throw new Error('All fields are required');
    }
    try {
        const student = new studentModel({ fullname, email, password });
        await student.save();
        return student;
    } catch (error) {
        throw new Error(error);
    }
}

