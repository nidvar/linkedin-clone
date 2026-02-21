import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { faker } from '@faker-js/faker';

const createFakeUsers = function(){
    const users = Array.from({ length: 100 }).map(() => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        fullName: faker.person.firstName() + ' ' + faker.person.lastName(),
        profilePicture: 'https://robohash.org/' + faker.person.firstName() + '.png',
        email: faker.internet.email(),
        password: "12345678", // or hashed if required
        jobTitle: faker.person.jobTitle(),
        company: faker.company.name(),
        location: faker.location.city(),
        connections: [],
        createdAt: new Date()
    }));

    return users
}

export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to jarro_mongodb cluster jarro');

        // await User.insertMany(createFakeUsers());

    }catch(error){
        console.log(error);
    }
};