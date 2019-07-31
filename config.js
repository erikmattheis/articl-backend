const config = {
  app: {
    port: 3000
  },
  db: {
    account: 'root',
    host: 'cluster0-jl94d.gcp.mongodb.net',
    name: 'articleDatabase',
    other: 'retryWrites=true&w=majority',
    //  password: process.env.PASSWORD
    password: 'srCm5ybwwKC8aXFq'
  }
};

module.exports = config;
