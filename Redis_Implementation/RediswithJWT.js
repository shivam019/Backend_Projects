const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('redis');

const app = express();
const port = 3000;

// Create a Redis client
const redisClient = redis.createClient();

// Secret key for JWT signing (replace with your own secret key)
const secretKey = 'your-secret-key';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    // Attach decoded user information to the request object
    req.user = decoded;
    next();
  });
};

// Example route to generate a JWT and store it in Redis
app.get('/login', (req, res) => {
  // For demonstration purposes, assume successful authentication
  const user = {
    id: 123,
    username: 'example_user',
  };

  // Generate a JWT
  const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

  // Store the JWT in Redis with a short expiration time
  redisClient.setex(user.id.toString(), 3600, token);

  res.json({ token });
});

// Example route that requires authentication
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
