import redis from "../redis/redis";

const RATE_LIMIT_TIME_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per time window


export async function checkRateLimit(ip: string) {
    const key = `rate-limit:${ip}`;
    const requestCount = await redis.get(key);
    console.log(`IP: ${ip}, Current Request Count: ${requestCount}`);

    if (requestCount) {
        const count = parseInt(requestCount, 10);
        if (count >= MAX_REQUESTS_PER_WINDOW) {
            return false; // Rate limit exceeded
        }
        // Increment the request count
        await redis.incr(key);
    } else {
        // Initialize the request count and set the expiration time for the key
        await redis.set(key, 1, 'PX', RATE_LIMIT_TIME_WINDOW);
    }
    return true;
}