const { promisifyAll } = require('tsubaki');
const redisClient = require('redis');
const winston = require('winston');

const { REDIS } = process.env;

promisifyAll(redisClient.RedisClient.prototype);
promisifyAll(redisClient.Multi.prototype);

const redis = redisClient.createClient({user: "ChariZard", password: "uOAdBZurlrudJtAHtTcWSJfYp4OCRfYL", host: "redis-17159.c9.us-east-1-2.ec2.cloud.redislabs.com", port: 17159 });

class Redis {
	static get db() {
		return redis;
	}

	static start() {
		redis.on('error', error => winston.error(`[REDIS]: Encountered error: \n${error}`))
			.on('reconnecting', () => winston.warn('[REDIS]: Reconnecting...'));
	}
}

module.exports = Redis;