const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('error', (error) => {
    console.log('Error @ ' + err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

module.exports = redisClient