const sizeof = require('object-sizeof');

const startMemory = {};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

module.exports = {
  start: handle => {
    startMemory[handle] = process.memoryUsage();
  },
  stop: handle => {
    const rssDifference = formatBytes(process.memoryUsage().rss - startMemory[handle].rss);
    console.info(`memoryUsage.rss difference ${handle}:  ${rssDifference}`);
    const heapTotalDifference = formatBytes(process.memoryUsage().rss - startMemory[handle].rss);
    console.info(`memoryUsage.heapTotal difference ${handle}:  ${heapTotalDifference}`);
    const heapUsedDifference = formatBytes(process.memoryUsage().heapUsed - startMemory[handle].heapUsed);
    console.info(`memoryUsage.heapUsed difference ${handle}:  ${heapUsedDifference}`);
    const externalDifference = formatBytes(process.memoryUsage().external - startMemory[handle].external);
    console.info(`memoryUsage.external difference ${handle}:  ${externalDifference}`);
  },
  sizeof: (obj, handle) => {
    console.log(`${handle} is ${formatBytes(sizeof(obj))}`);
  }
};
