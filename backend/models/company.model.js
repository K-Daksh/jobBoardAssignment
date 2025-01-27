const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    postedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationOtp: {
        type: String,
        select: false
    },
    otpExpiry: {
        type: Date,
        select: false
    }
});

companySchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

companySchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

companySchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const companyModel = mongoose.model('company', companySchema);

module.exports = companyModel;
