/ async function main(){
//     let startTime = new Date(); // 开始时间
// console.log(`now is : ${startTime}`)
//     await setTimeout(function(){console.log(`set time out`)},3000);
// let endTime = new Date(); // 结束时间
// console.log(`now is : ${endTime}`)
// let usedTime = endTime - startTime;
// console.log(`now is : ${usedTime}`)
// };

// main();

const express = require('express');
const cacache = require('cacache/en')
const fs = require('fs')
const key = 'my-categories'
const cachePath = './'
const destination = './my.txt'
const app = express();

//  insert JSON file
//  const fileName = '/Users/yueyin/Desktop/category.json';
const fileName = './test.json';
console.log(`path：${fileName}`);
const fileContent = fs.readFileSync(fileName);

cacache.put(cachePath, key, fileContent).then(integrity => {
 console.log(`Saved content to ${cachePath}.`)
})

let data02 = ''

cacache.get.stream(
 cachePath, 'my-categories'
).on('data', data => {
 console.log('data:', data.toString())
 data02 = data;
});

console.log('data02:', data02.toString())

async function f(req,res,next) {

   let promise = new Promise((resolve, reject) => {
     setTimeout(() => resolve("done!"), 2000)
   });
   // setTimeout(() => console.log("lalala 7000!"), 7000)
   // setTimeout(() => console.log("lalala 4000!"), 3000)
   let result = await promise; // wait till the promise resolves (*)
   console.log(result);
   console.log('this is f'); // "done!"
   next();
 }

 async function g() {

   let promise = new Promise((resolve, reject) => {
     setTimeout(() => resolve("done!"), 2000)
   });

   let result = await promise; // wait till the promise resolves (*)
   console.log(result);
   console.log('this is g'); // "done!"
 }


// async function c(){
//     await f();
//     g();
// }

// c();

app.get('/',f,g);


app.listen(5000);
console.log('listening to port 5000');