import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserModel = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    activated: {
        type: Boolean,
        required: true,
        default: false
    },
    activationLink: {
        type: String,
        required: true
    }
})

export default model( 'User', UserModel);