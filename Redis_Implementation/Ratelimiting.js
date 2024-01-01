// Middleware function for rate limiting
const rateLimiter = (req, res, next) => {
    const ipAddress = req.ip; // Use IP address for simplicity (consider using user ID in a real-world scenario)
  
    // Check if the IP address is within the rate limit
    redisClient.get(ipAddress, (err, data) => {
      if (err) throw err;
  
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const storedData = JSON.parse(data) || { timestamp: 0, count: 0 };
  
      if (
        storedData.timestamp + expirationTime < currentTimestamp ||
        storedData.count < rateLimit
      ) {
        // Allow the request
        redisClient.set(
          ipAddress,
          JSON.stringify({
            timestamp: currentTimestamp,
            count: storedData.count + 1,
          }),
          'EX',
          expirationTime
        );
        next();
      } else {
        // Reject the request due to rate limit exceeded
        res.status(429).json({ error: 'Rate limit exceeded' });
      }
    });
  };
  