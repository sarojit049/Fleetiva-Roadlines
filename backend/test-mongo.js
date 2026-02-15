
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/fleetiva';

console.log('Testing connection to:', uri);

mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('Successfully connected to local MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('Failed to connect to local MongoDB:', err.message);
        process.exit(1);
    });
