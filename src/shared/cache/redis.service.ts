// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Redis from 'ioredis';
// import { Logger } from '@nestjs/common';

// @Injectable()
// export class RedisService implements OnModuleInit, OnModuleDestroy {
//   private readonly logger = new Logger(RedisService.name);
//   private client: Redis;

//   constructor(private configService: ConfigService) {}

//   async onModuleInit() {
//     try {
//       this.client = new Redis({
//         host: this.configService.get('REDIS_HOST'),
//         port: this.configService.get('REDIS_PORT'),
//         password: this.configService.get('REDIS_PASSWORD'),
//         retryStrategy: (times) => {
//           const delay = Math.min(times * 50, 2000);
//           return delay;
//         },
//       });

//       this.client.on('connect', () => {
//         this.logger.log('Connected to Redis');
//       });

//       this.client.on('error', (error) => {
//         this.logger.error('Redis error:', error);
//       });
//     } catch (error) {
//       this.logger.error('Failed to connect to Redis:', error);
//     }
//   }

//   async onModuleDestroy() {
//     if (this.client) {
//       await this.client.quit();
//     }
//   }

//   async get(key: string): Promise<string | null> {
//     return await this.client.get(key);
//   }

//   async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
//     if (ttlSeconds) {
//       await this.client.set(key, value, 'EX', ttlSeconds);
//     } else {
//       await this.client.set(key, value);
//     }
//   }

//   async del(key: string): Promise<void> {
//     await this.client.del(key);
//   }

//   async exists(key: string): Promise<boolean> {
//     const result = await this.client.exists(key);
//     return result === 1;
//   }

//   async incr(key: string): Promise<number> {
//     return await this.client.incr(key);
//   }

//   async expire(key: string, ttlSeconds: number): Promise<void> {
//     await this.client.expire(key, ttlSeconds);
//   }
// }
