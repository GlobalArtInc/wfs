const { ShardingManager } = require('discord.js');
const path = require('path');

const manager = new ShardingManager(path.join(__dirname, 'main.js'), {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
});

manager.on('shardCreate', (shard: any) => {
  shard.on('reconnecting', () => {
    console.log(`Reconnecting shard: [${shard.id}]`);
  });

  shard.on('spawn', () => {
    console.log(`Spawned shard: [${shard.id}]`);
  });

  shard.on('ready', () => {
    console.log(` Shard [${shard.id}] is ready`);
  });

  shard.on('death', () => {
    console.log(`Died shard: [${shard.id}]`);
  });

  shard.on('error', (err: Error) => {
    console.log(`Error in  [${shard.id}] with : ${err} `);
    shard.respawn();
  });
});

manager.spawn();
