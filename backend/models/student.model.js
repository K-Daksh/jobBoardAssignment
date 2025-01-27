const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const studentSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: true,
        minlength: [5, 'Email must be at least 6 characters long']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    }]
});

studentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

studentSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const studentModel = mongoose.model('student', studentSchema);

module.exports = studentModel;