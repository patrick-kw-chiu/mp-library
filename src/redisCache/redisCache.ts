import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

interface ObjectInterface {
    [key: string]: any;
}

const getHandler = (client: RedisClientType) => {
    return async (key: string) => {
        let value: null | string | ObjectInterface = await client.get(key);
        if (!value) {
            return { value };
        }
        try {
            value = JSON.parse(value) as ObjectInterface;
            return value;
        } catch (e) {}
        return { value };
    };
};

const setHandler = (client: RedisClientType) => {
    return async (
        key: string,
        value: string | Record<string, any>,
        options: Record<string, any> = {
            EX: 60,
        }
    ) => {
        try {
            const stringifiedValue = JSON.stringify(value);
            await client.set(key, stringifiedValue, options);
        } catch (e) {
            await client.set(key, value.toString(), options);
        }
    };
};

export const initRedisCache = async (key: string, url: string) => {
    const client: RedisClientType = createClient({ url });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    redisCache[key] = {
        get: getHandler(client),
        set: setHandler(client),
        disconnect: () => client.disconnect(),
    };
    return {
        get: getHandler(client),
        set: setHandler(client),
        disconnect: () => client.disconnect(),
    };
};

const redisCache: Record<string, any> = {
    initRedisCache,
};

export default redisCache;
