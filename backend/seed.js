const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Team = require('./models/Team');
const Alert = require('./models/Alert');
const UserAlertState = require('./models/UserAlertState');

const seedDatabase = async () => {
    try {
        console.log('Clearing old data...');
        await Promise.all([
            User.deleteMany({}),
            Team.deleteMany({}),
            Alert.deleteMany({}),
            UserAlertState.deleteMany({}),
        ]);
        console.log('Old data cleared.');

        // Create Teams
        const engineering = await Team.create({ name: 'Engineering' });
        const marketing = await Team.create({ name: 'Marketing' });
        console.log('Teams created.');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('password123', salt);
        const userPass = await bcrypt.hash('password123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminPass,
            role: 'Admin'
        });

        const user1 = await User.create({
            name: 'Alice (Engineer)',
            email: 'alice@example.com',
            password: userPass,
            teamId: engineering._id
        });

        const user2 = await User.create({
            name: 'Bob (Engineer)',
            email: 'bob@example.com',
            password: userPass,
            teamId: engineering._id
        });
        
        const user3 = await User.create({
            name: 'Charlie (Marketing)',
            email: 'charlie@example.com',
            password: userPass,
            teamId: marketing._id
        });

        console.log('Users created.');
        console.log('--- SEED DATA ---');
        console.log('Admin: admin@example.com / password123');
        console.log('User: alice@example.com / password123');
        console.log('-----------------');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // You might want to close the connection if running this as a standalone script
        // mongoose.connection.close();
    }
};

module.exports = seedDatabase;