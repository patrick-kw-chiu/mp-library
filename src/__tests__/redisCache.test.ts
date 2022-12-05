import redisCache, { initRedisCache } from '../redisCache/redisCache';

describe('redisCache', () => {
    it('set and get', async () => {
        const cache = await initRedisCache('test', process.env.REDIS_URL || '');

        await cache.set('key-1', { foo: 'bar' }, { EX: 60 });

        const value = await cache.get('key-1');
        expect(value.foo).toBe('bar');

        const valueFromRedisCache = await redisCache.test.get('key-1');
        expect(valueFromRedisCache.foo).toBe('bar');

        await cache.disconnect();
    });
});
