const fs = require('fs');


let data = fs.readFileSync('./category.json', 'utf8');
data = JSON.parse(data);
const { categories } = data;
console.log('do open');

module.exports.categories = categories;
