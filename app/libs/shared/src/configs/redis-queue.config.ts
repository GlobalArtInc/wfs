export const WS_SOCKET_QUEUE = 'ws_socket_queue';

export function getRedisQueueConfig() {
  return {
    redis: {
      db: +process.env.IN_MEMORY_QUEUE_REDIS_DATABASE,
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      sentinels: [{ host: process.env.REDIS_SENTINEL_HOST, port: +process.env.REDIS_SENTINEL_PORT }],
      name: process.env.REDIS_SENTINEL_MASTER_NAME,
    },
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  };
}
