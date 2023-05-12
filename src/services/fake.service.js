const Articls = {};



  const result = await initializeSomething();
  Articls.ok = `I'm ${result}!}`;
console.log('Articls.ok 1', Articls.ok);



function initializeSomething() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
    }, 1000);
  });
}

module.exports = Articls;
