import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private isConnected = false;
  private subscriber: Redis; // Separate client for pub/sub

  constructor(private readonly configService: ConfigService) {}
  async onModuleInit() {
    await this.connect();
  }
  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect() {
    try {
      const config = this.configService.get('redis');

      this.client = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        retryStrategy: config.retryStrategy,
        maxRetriesPerRequest: config.maxRetriesPerRequest,
        enableReadyCheck: config.enableReadyCheck,
        lazyConnect: true, // Connect on first command
      });

      this.subscriber = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        retryStrategy: config.retryStrategy,
        lazyConnect: true,
      });

      // Event listeners for main client
      this.client.on('connect', () => {
        console.log(`Redis connected on ${config.host}:${config.port}`);
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('Redis ready');
      });

      this.client.on('error', (error) => {
        console.error('Redis error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.warn('Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', (delay) => {
        console.log(`Redis reconnecting in ${delay}ms`);
      });

      // Connect both clients
      await Promise.all([this.client.connect(), this.subscriber.connect()]);
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
        console.log('Redis client disconnected');
      }

      if (this.subscriber) {
        await this.subscriber.quit();
        console.log('Redis subscriber disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    } finally {
      this.isConnected = false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  // ============ BASIC OPERATIONS ============
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string | number | Buffer,
    ttlSeconds?: number,
  ): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.setex(key, ttlSeconds, value);
    }
    return this.client.set(key, value);
  }

  async del(key: string[]): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, ttlSeconds: number): Promise<number> {
    return this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // ============ HASH OPERATIONS ============
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    return this.client.hdel(key, field);
  }

  // ============ LIST OPERATIONS ============
  async lpush(key: string, value: string): Promise<number> {
    return this.client.lpush(key, value);
  }

  async rpush(key: string, value: string): Promise<number> {
    return this.client.rpush(key, value);
  }

  async lpop(key: string): Promise<string | null> {
    return this.client.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  // ============ SET OPERATIONS ============
  async sadd(key: string, member: string[]): Promise<number> {
    return this.client.sadd(key, member);
  }

  async srem(key: string, member: string[]): Promise<number> {
    return this.client.srem(key, member);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  // ============ SORTED SET OPERATIONS ============
  async zadd(
    key: string,
    score: number,
    member: string,
  ): Promise<string | number> {
    return this.client.zadd(key, score, member);
  }

  async zrange(
    key: string,
    start: number,
    stop: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    if (withScores) {
      return this.client.zrange(key, start, stop, 'WITHSCORES');
    }
    return this.client.zrange(key, start, stop);
  }

  async zrem(key: string, member: string): Promise<number> {
    return this.client.zrem(key, member);
  }

  // ============ PUB/SUB OPERATIONS ============
  async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (channel: string, message: string) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (Array.isArray(channel) ? channel.includes(ch) : channel === ch) {
        callback(ch, msg);
      }
    });
  }

  async unsubscribe(channel?: string): Promise<void> {
    if (channel) {
      await this.subscriber.unsubscribe(channel);
    } else {
      await this.subscriber.unsubscribe();
    }
  }

  // ============ PIPELINE & TRANSACTIONS ============

  // ============ UTILITY METHODS ============

  // ============ JSON OPERATIONS (if using RedisJSON) ============

  // ============ LUA SCRIPTS ============

  // ============ BATCH OPERATIONS ============
}
