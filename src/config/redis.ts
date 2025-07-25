import Redis from 'ioredis';

export class RedisService extends Redis {
  constructor() {
    /*const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    };*/
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379');

    super(port, host, {
      password: process.env.REDIS_PASSWORD,
    });

    super.on('error', (err) => {
      console.log('Erro no Redis.');
      console.log(err);
      process.exit(1);
    });

    super.on('connect', () => {
      console.log('Redis conectado. ');
    });
  }
}
