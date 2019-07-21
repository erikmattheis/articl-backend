const startTimes = {};

module.exports = {
  start: handle => {
    startTimes[handle] = process.hrtime();
  },
  stop: handle => {
    const hrend = process.hrtime(startTimes[handle]);
    console.info(`Execution time ${handle}: %ds %dms`, hrend[0], hrend[1] / 1000000);
  }
};
