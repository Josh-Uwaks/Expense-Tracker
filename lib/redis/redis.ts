import Redis from 'ioredis'

const redisURL = process.env.REDIS_URL

if(!redisURL) {
  throw new Error("Redis URL Environment Variable is not defined")
}

const redis = new Redis(redisURL)

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('error', (error) => {
    console.error('Redis connection error:', error);
});

export default redis;