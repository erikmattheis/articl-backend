const fs = require('fs');

module.exports = {
  devServer: {
    port: '5000',
    https: {
      key: fs.readFileSync('/etc/ssl/certs/server.key'),
      cert: fs.readFileSync('/etc/ssl/certs/server.crt'),
    },
  },
};
