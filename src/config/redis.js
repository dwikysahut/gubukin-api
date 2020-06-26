const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('error', (error) => {
    console.log('Error @ ' + error);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

module.exports = redisClient