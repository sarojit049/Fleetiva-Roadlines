
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const fetch = require('node-fetch'); // Needs to be installed or use native fetch if Node 18+

// Data Models
const User = require('./models/User');
const Truck = require('./models/Truck');
const Load = require('./models/Load');
const Booking = require('./models/Booking');
const Bilty = require('./models/Bilty');

// Config
require('dotenv').config();
const MONGO_URI = 'mongodb://localhost:27017/fleetiva';
console.log('ENV MONGO_URI was:', process.env.MONGO_URI);
const PORT = process.env.PORT || 11000;
const API_URL = `http://127.0.0.1:${PORT}/api`;
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'testsecret'; // Fallback if env missing

async function run() {
    try {
        console.log('Connecting to MongoDB...', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        // 1. Create/Get Admin User
        let admin = await User.findOne({ email: 'admin@test.com' });
        if (!admin) {
            admin = await User.create({
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'password123', // In real app, this should be hashed, but for JWT generation we just need the ID/Role
                role: 'admin',
                isVerified: true
            });
            console.log('Created Admin User');
        }

        // 2. Generate Token
        const token = jwt.sign(
            { userId: admin._id, role: admin.role, email: admin.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('Generated Admin Token');

        // 3. Create Dummy Data for Booking
        const customer = await User.create({ name: 'Cust', email: `cust${Date.now()}@test.com`, role: 'customer' });
        const driver = await User.create({ name: 'Driv', email: `driv${Date.now()}@test.com`, role: 'driver', phone: '1234567890' });

        const truck = await Truck.create({
            driver: driver._id,
            vehicleNumber: `MH12AB${Date.now().toString().slice(-4)}`,
            vehicleType: 'Container',
            capacity: 10,
            currentLocation: 'Mumbai',
            isAvailable: true
        });

        const load = await Load.create({
            customer: customer._id,
            from: 'Mumbai',
            to: 'Pune',
            material: 'Steel',
            consignorName: 'Test Consignor',
            consigneeName: 'Test Consignee',
            weight: 5,
            requiredCapacity: 5,
            status: 'pending'
        });

        // 4. Create Booking (Directly to save time)
        const booking = await Booking.create({
            load: load._id,
            truck: truck._id,
            driver: driver._id,
            customer: customer._id,
            status: 'assigned',
            paymentStatus: 'pending',
            freightAmount: 5000,
            advancePaid: 1000,
            balanceAmount: 4000,
            paymentMode: 'cash',
            gstAmount: 0,
            from: 'Mumbai',
            to: 'Pune'
        });
        console.log('Created Booking:', booking._id);

        // 5. Test POST /api/bilty
        const payload = {
            booking: booking._id.toString(),
            // lrNumber: 'LR-TEST-123', // Optional
            consignorName: 'Test Consignor',
            consigneeName: 'Test Consignee',
            pickupLocation: 'Mumbai',
            dropLocation: 'Pune',
            materialType: 'Steel',
            weight: 5,
            truckType: 'Container',
            driverName: 'Driv',
            driverPhone: '1234567890',
            vehicleNumber: truck.vehicleNumber,
            freightAmount: 5000,
            advancePaid: 1000,
            balanceAmount: 4000,
            paymentMode: 'cash', // Testing 'cash' which is valid in both Joi and Mongoose
            shipmentStatus: 'assigned'
        };

        console.log('Sending Payload to API...');
        const response = await fetch(`${API_URL}/bilty`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS: Bilty Created!', data);
        } else {
            console.error('❌ FAILED:', response.status, data);
        }

        // Test ENUM Mismatch Fix (Try 'bank')
        const payload2 = { ...payload, booking: (await Booking.create({ ...booking.toObject(), _id: new mongoose.Types.ObjectId() }))._id.toString(), paymentMode: 'bank' };
        console.log('Testing "bank" payment mode (valid in Mongoose, was invalid in Joi)...');

        const response2 = await fetch(`${API_URL}/bilty`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload2)
        });

        const data2 = await response2.json();

        if (response2.ok) {
            console.log('✅ SUCCESS: "bank" payment mode worked!', data2);
        } else {
            console.error('❌ FAILED "bank" test:', response2.status, data2);
        }

    } catch (err) {
        console.error('Script Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
