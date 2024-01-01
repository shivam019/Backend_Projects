const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 3001;

// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB URI)
mongoose.connect('your_mongodb_uri', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model('User', {
  _id: String,
  name: String,
  email: String,
});

const client = redis.createClient();
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);

// Middleware for distributed lock
const acquireLock = async (req, res, next) => {
  const userId = req.params.userId;
  const lockKey = `userLock:${userId}`;
  const lockValue = Date.now().toString() + Math.random().toString();

  const result = await setAsync(lockKey, lockValue, 'NX');

  if (result === 'OK') {
    // Lock acquired, proceed to update the user's profile
    next();
  } else {
    // Lock not acquired, respond with conflict status
    res.status(409).json({ error: 'User profile is being modified by another microservice.' });
  }
};

// Example route to update a user's profile
app.put('/update-profile/:userId', acquireLock, async (req, res) => {
  const userId = req.params.userId;

  // Simulate updating user's profile (replace with actual logic)
  console.log(`Microservice 1 updating profile for user ${userId}...`);

  try {
    // Fetch user from MongoDB
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Update user's profile
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Save the updated user to MongoDB
    await user.save();

    console.log(`Profile for user ${userId} updated by Microservice 1.`);

    // Release the lock after updating the profile
    const lockKey = `userLock:${userId}`;
    await delAsync(lockKey);

    res.json({ message: `Profile for user ${userId} updated successfully by Microservice 1.` });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Microservice 1 is running on port ${port}`);
});
