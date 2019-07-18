const config = {
  app: {
    port: 3000,
  },
  db: {
    host: 'cluster0-jl94d.gcp.mongodb.net',
    name: 'articleDatabase',
    account: 'root',
    password: 'zuY78tsOS6fOvVZY',
    other: 'retryWrites=true&w=majority',
  },
};

module.exports = config;
